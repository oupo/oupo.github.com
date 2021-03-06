var factory_data = null;
var pokemon_data = null;
var pokemon_name2id = null;
var trainer_names = null;
var natures = "がんばりや さみしがり ゆうかん いじっぱり やんちゃ ずぶとい すなお のんき わんぱく のうてんき おくびょう せっかち まじめ ようき むじゃき ひかえめ おっとり れいせい てれや うっかりや おだやか おとなしい なまいき しんちょう きまぐれ".split(" ");
var rank_entries_count = [null, 150, 100, 100, 136, 136, 136, 136];
var rank_entries_start;
var rank_entries_end;

// rankという変数だけでポケモンがどの決定方法かを判別できるようにするため
// 以下の特殊なランクを設定する
var RANK_8_LV50                  =  8, // ランク8 (Lv50 最初の6匹)
    RANK_8_OPEN                  =  9, // ランク8 (オープン 最初の6匹)
    RANK_8_ENEMY                 = 10, // ランク8 (相手)
    RANK_OPEN_8                  = 11, // オープンレベル最初の6匹 8周目
    RANK_OPEN_SILVER_NEJIKI_PT   = 12, // オープン銀ネジキ(pt)
    RANK_OPEN_SILVER_NEJIKI_HGSS = 13, // オープン銀ネジキ(hgss)
    RANK_LV50_GOLD_NEJIKI_PT     = 14, // Lv50金ネジキ(pt)
    RANK_LV50_GOLD_NEJIKI_HGSS   = 15, // Lv50金ネジキ(hgss)
    RANK_OPEN_GOLD_NEJIKI        = 16; // オープン金ネジキ

(function() {
	function set(i, j) {
		// ランクjの最初から準伝説の最後までの範囲に設定
		var start = rank_entries_start[j];
		var count = 950 - start;
		rank_entries_start[i] = start;
		rank_entries_count[i] = count;
	}
	function copy(to, from) {
		rank_entries_count[to] = rank_entries_count[from];
		rank_entries_start[to] = rank_entries_start[from];
	}
	function set_start() {
		// ランク1～7までのrank_entries_startを設定
		rank_entries_start = [null];
		var n = 0;
		for (var i = 1; i <= 7; i ++) {
			rank_entries_start[i] = n;
			n += rank_entries_count[i];
		}
	}
	function set_end() {
		// すべてのランクのrank_entries_endを設定
		rank_entries_end = [null];
		for (var i = 1; i < rank_entries_count.length; i ++) {
			var count = rank_entries_count[i];
			var start = rank_entries_start[i];
			rank_entries_end[i] = start + count - 1;
		}
	}
	
	set_start();
	set(RANK_8_LV50, 4);
	set(RANK_8_OPEN, 6);
	set(RANK_8_ENEMY, 4);
	set(RANK_OPEN_8, 4);
	set(RANK_OPEN_SILVER_NEJIKI_PT, 7);
	copy(RANK_OPEN_SILVER_NEJIKI_HGSS, 4);
	copy(RANK_LV50_GOLD_NEJIKI_PT, 4);
	set(RANK_LV50_GOLD_NEJIKI_HGSS, 7);
	set(RANK_OPEN_GOLD_NEJIKI, 7);
	set_end();
})();

function boot_factory_scouter() {
	initialize_factory(function() {
		$(document.forms.entries_form).submit(on_submit_entries);
		$(document.forms.seed_form).submit(on_submit_seed);
		$(document.forms.entries_form.entries).keyup(update_bonus_hint).click(update_bonus_hint);
		$("#shuu_input").keyup(update_bonus_hint);
		$(document.forms.shuu_form.level).click(update_bonus_hint);
		update_bonus_hint();
	});
}

function initialize_factory(callback) {
	var factory_data_text;
	var pokedex_csv_text;
	var trainer_names_text;
	$.ajax({dataType: "text", url: "factory_data.txt", success: function(data) {
		factory_data_text = data;
		boot();
	}});
	$.ajax({dataType: "text", url: "pokedex.csv?20091120", success: function(data) {
		pokedex_csv_text = data;
		boot();
	}});
	$.ajax({dataType: "text", url: "trainer.txt", success: function(data) {
		trainer_names_text = data;
		boot();
	}});
	function boot() {
		if (!factory_data_text || !pokedex_csv_text || !trainer_names_text) return;
		initialize_pokemon_data(pokedex_csv_text);
		initialize_factory_entries(factory_data_text);
		set_pokemon_data_group();
		initialize_trainer_names(trainer_names_text);
		callback();
	}
}

function initialize_pokemon_data(pokedex_csv_text) {
	var lines = pokedex_csv_text.split("\n");
	if (lines[lines.length - 1] === "") lines.pop();
	var boundaries = {"♂のみ": -1, "♀のみ": 255, "1:7": 30, "1:3": 63, "1:1": 126, "3:1": 190, "ふめい": null};
	pokemon_data = new Array(lines.length);
	pokemon_name2id = {};
	for (var i = 0; i < lines.length; i ++) {
		var row = lines[i].split(",");
		var name = row[0];
		var stats = map(row.slice(1, 1 + 6), Number);
		var ability1 = row[7];
		var ability2 = row[8] || ability1;
		var gender_boundary = boundaries[row[9]];
		pokemon_name2id[name] = i;
		pokemon_data[i] = {
			id: i,
			name: name,
			stats: stats,
			abilities: [ability1, ability2],
			gender_boundary: gender_boundary,
			group: null,
			id_in_group: null
		};
	}
}

function initialize_factory_entries(factory_data_text) {
	var lines = factory_data_text.split("\n");
	if (lines[lines.length - 1] === "") lines.pop();
	factory_data = new Array(lines.length);
	for (var i = 0; i < lines.length; i ++) {
		var row = lines[i].split("|");
		var pokemon = get_pokemon_entry(row[1]);
		factory_data[i] = {
			id: i,
			name:   row[1],
			pokemon: pokemon,
			nature: indexof(natures, row[2]),
			item:   row[3],
			move:   row[4],
			effort: omit_effort_text(row[5])
		};
	}
}

function set_pokemon_data_group() {
	// ランク1のポケモン
	for (var i = 0; i <= rank_entries_end[1]; i ++) {
		var pokemon = factory_data[i].pokemon;
		pokemon.group = 1;
		pokemon.id_in_group = i;
	}
	// ランク2,3のポケモン
	for (var i = rank_entries_start[2]; i <= rank_entries_end[2]; i ++) {
		var pokemon = factory_data[i].pokemon;
		pokemon.group = 2;
		pokemon.id_in_group = i - rank_entries_start[2];
	}
	// ランク4～7のポケモン
	for (var i = rank_entries_start[4]; i <= rank_entries_end[4]; i ++) {
		var pokemon = factory_data[i].pokemon;
		pokemon.group = 3;
		pokemon.id_in_group = i - rank_entries_start[4];
	}
	// 準伝説
	var start = rank_entries_end[7] + 1;
	var end = start + 14;
	for (var i = start; i < end; i ++) {
		var pokemon = factory_data[i].pokemon;
		pokemon.group = 4;
		pokemon.id_in_group = i - start;
	}
}

var silver_nejiki_id;
var gold_nejiki_id;
var dummy_trainer_start_id;

function initialize_trainer_names(trainer_names_text) {
	var lines = trainer_names = trainer_names_text.split("\n");
	if (lines[lines.length - 1] === "") lines.pop();
	// 300番目,301番目のトレーナーをそれぞれ銀ネジキ、金ネジキとして扱う
	silver_nejiki_id = lines.length;
	lines.push("ファクトリーヘッドのネジキ");
	gold_nejiki_id = lines.length;
	lines.push("ファクトリーヘッドのネジキ");
	dummy_trainer_start_id = lines.length;
	for (var i = 0; i < 8; i ++) {
		lines.push("");
	}
}

// トレーナー候補が一つも見つからなかったときのためのダミー用トレーナー
function get_dummy_trainer_id(shuu) {
	return dummy_trainer_start_id + (Math.min(shuu, 8) - 1);
}

var context = null;
var search_timer_id = null;
var progress_div = null;

function on_submit_entries() {
	cancel_search();
	Lock.cancel();
	var is_open_level = read_level_radio();
	var is_hgss = read_hgss_radio();
	var shuu = read_shuu_input(is_open_level, true);
	if (shuu === null) return;
	var f = document.forms.entries_form;
	var r = parse_text(shuu, is_open_level, f.entries.value);
	if (r.errors.length > 0) {
		build_parse_text_error_message(r.errors);
		return;
	}
	start_search(shuu, is_open_level, is_hgss, r.entries, r.parent_ids, r.is_bonus_list);
}

function start_search(shuu, is_open_level, is_hgss, entries, parent_ids, is_bonus_list) {
	var num_bonus = FindSeedProcedure.gen_bonus_entries(entries, is_bonus_list).length;
	var procedure = new FindSeedProcedure(shuu, is_open_level, entries, parent_ids, is_bonus_list);
	loop();
	function loop() {
		var seed = procedure.run(100);
		if (seed === "timeout") {
			if (!progress_div) progress_div = build_progress_div();
			set_progress(progress_div, procedure.get_ratio());
			search_timer_id = setTimeout(loop, 0);
		} else {
			if (progress_div) remove_progress_div(progress_div);
			progress_div = null;
			search_timer_id = null;
			if (seed === null) {
				$("#result").html("<p>その組み合わせのseedが見つかりません。</p>");
				var insufficient = get_insufficient_parent_ids(parent_ids, is_bonus_list);
				if (insufficient) {
					$("#result").append("<p>"+insufficient+"の親IDも指定してみてください。</p>");
				}
				return;
			}
			build_result_div(shuu, is_open_level, is_hgss, seed, 0, num_bonus, false, null);
		}
	}
}

function get_insufficient_parent_ids(parent_ids, is_bonus_list) {
	var result = [];
	var ns = [0, 4, 5];
	for (var i = 0; i < 3; i ++) {
		var n = ns[i];
		if (!is_bonus_list[n] && parent_ids[n] === null) {
			result.push((n+1)+"匹目");
		}
	}
	if (result.length > 0) {
		return result.join(", ");
	} else {
		return null;
	}
}

function on_submit_seed() {
	cancel_search();
	Lock.cancel();
	var is_open_level = read_level_radio();
	var is_hgss = read_hgss_radio();
	var shuu = read_shuu_input(is_open_level, true);
	if (shuu === null) return;
	var f = document.forms.seed_form;
	var start_by_trainers = f.seed_timing[f.seed_timing.selectedIndex].value === "trainers";
	var seed = read_int_string(f.seed.value);
	var consumption = read_int_string(f.consumption.value, 0);
	var num_bonus = read_int_string(f.num_bonus.value, 0);
	if (seed === null) {
		alert("seedに入力されている値が不正です");
		return;
	}
	if (consumption === null) {
		alert("消費量に入力されている値が不正です");
		return;
	}
	if (num_bonus === null || num_bonus < 0 || num_bonus > 6) {
		alert("ボーナスポケモンの数に入力されている値が不正です");
		return;
	}
	seed = step_seed(seed, consumption);
	var trainers_start_offset = null;
	if (start_by_trainers) {
		var trainers = get_trainers_by_seed(shuu, seed, is_hgss);
		seed = step_seed(seed, trainers.consumption);
		consumption += trainers.consumption;
		trainers_start_offset = -trainers.consumption;
	}
	build_result_div(shuu, is_open_level, is_hgss, seed, consumption, num_bonus, true, trainers_start_offset);
}

function cancel_search() {
	clearTimeout(search_timer_id);
	if (progress_div) remove_progress_div(progress_div);
	progress_div = null;
}

function read_shuu_input(is_open_level, show_error) {
	var value = read_int_string(document.getElementById("shuu_input").value);
	var error = null;
	if (value === null || value < 1) {
		error = "周に入力されている値が不正です";
	}
	if (error) {
		value = null;
		if (show_error) alert(error);
	}
	return value;
}

function read_level_radio() {
	var radios = document.forms.shuu_form.level;
	var val = radios[get_checked_radio_index(radios)].value;
	return val === "100";
}

function read_hgss_radio() {
	var radios = document.forms.shuu_form.version;
	var val = radios[get_checked_radio_index(radios)].value;
	return val === "hgss";
}

var progress_width = 100;

function build_progress_div() {
	var p = document.forms.entries_form.entries_submit.parentNode;
	var div = document.createElement("div");
	addClass(div, "progress");
	div.style.width = (progress_width + 2) + "px";
	var bar = document.createElement("div");
	addClass(bar, "progress_bar");
	div.appendChild(bar);
	p.appendChild(div);
	return div;
}

function set_progress(div, ratio) {
	div.firstChild.style.width = Math.floor(ratio * progress_width) + "px";
}

function remove_progress_div(div) {
	div.parentNode.removeChild(div);
}

function build_parse_text_error_message(errors) {
	var buf = "";
	buf += "<h2>エラー</h2>";
	buf += "<ul>";
	for (var i = 0; i < errors.length; i ++) {
		buf += "<li>"+ escapeHTML(errors[i]) + "</li>";
	}
	buf += "</ul>";
	$("#result").html(buf);
}

update_bonus_hint.last_data = {};

function update_bonus_hint() {
	var last_data = update_bonus_hint.last_data;
	var is_open_level = read_level_radio();
	var shuu = read_shuu_input(is_open_level, false);
	if (shuu === null) {
		$("#bonus-hint").empty();
		update_last_data(shuu, is_open_level, null, null, null);
		return;
	}
	var rank = fix_rank(shuu, is_open_level);
	var bonus_rank = fix_rank(shuu + 1, is_open_level);
	var textarea = document.forms.entries_form.entries;
	var text = textarea.value;
	var shuu_same = last_data.shuu === shuu && last_data.is_open_level === is_open_level;
	if (shuu_same && last_data.text === text) {
		return;
	}
	var r = parse_text(shuu, is_open_level, text);
	// parse_textの戻り値のentries, pokemons, is_bonus_listは重複しているものを除かないのでここで構築しなおす
	var entries = [];
	var pokemons = [];
	var is_bonus_list = [];
	for (var i = 0; i < r.entries.length; i ++) {
		var entry = r.entries[i];
		if (entries.length === 6) break;
		if (ary_include(pokemons, entry.pokemon)) continue;
		entries.push(entry);
		is_bonus_list.push(r.is_bonus_list[i]);
		pokemons.push(entry.pokemon);
	}
	var same = shuu_same && last_data.entries && ary_eq(entries, last_data.entries) && ary_eq(is_bonus_list, last_data.is_bonus_list);
	update_last_data(shuu, is_open_level, text, entries, is_bonus_list);
	if (same) {
		return;
	}
	if (entries.length === 0) {
		$("#bonus-hint").empty();
		return;
	}
	var candidates = [];
	for (var i = 0; i < entries.length; i ++) {
		var selected_entry = entries[i];
		var pokemon = selected_entry.pokemon;
		var es = [];
		candidates[i] = es;
		if (pokemon.group === 4) { // 準伝説
			for (var j = 1; j <= 4; j ++) {
				es.push(gen_candidate(pokemon_to_entry(8, pokemon, j),
				                      rank === 7 ? true : null,
				                      String(j), j));
			}
		} else if (rank >= 7) {
			// Lv50のランク8とオープンレベル7周目以降ではもともとランク4,ランク5のポケモンも出てくる
			if (!is_open_level || shuu >= 7) {
				es.push(gen_candidate(pokemon_to_entry(4, pokemon), true, "1", 1));
				es.push(gen_candidate(pokemon_to_entry(5, pokemon), true, "2", 2));
			}
			es.push(gen_candidate(pokemon_to_entry(6, pokemon),
			                      rank === 7 ? true : null, "3", 3));
			es.push(gen_candidate(pokemon_to_entry(7, pokemon),
			                      null, "4", 4));
		} else {
			var e = pokemon_to_entry(rank, pokemon);
			if (e) {
				es.push(gen_candidate(e, false, "通常", null));
			}
			var e = pokemon_to_entry(rank + 1, pokemon);
			if (e) {
				es.push(gen_candidate(e, true, "ボーナス", null));
			}
		}
		for (var j = 0; j < es.length; j ++) {
			if (shuu >= 8) { // 8周目以降は個体値に差がないので常にis_bonusはfalse扱いとする
				es[j].is_bonus = false;
			}
			if (es[j].is_bonus === null) {
				if (es[j].entry === selected_entry) {
					es[j].selected_is_bonus = is_bonus_list[i];
				} else {
					es[j].selected_is_bonus = false;
				}
			} else {
				es[j].selected_is_bonus = es[j].is_bonus;
			}
		}
	}
	var buf = "";
	if (shuu <= 7) {
		buf += "<p>ボーナスポケ: <span id=\"num_bonus\"></span>匹</p>";
	}
	buf += "<table><thead><th><th><th>アイテム<th>技<th>ステータス</thead>";
	buf += "<tbody>";
	for (var i = 0; i < entries.length; i ++) {
		buf += "<tr class=\"space\"><td colspan=\"4\"></td></tr>";
		build_rows(i, candidates[i], entries[i]);
	}
	buf += "</tbody></table>";
	buf += "</form>"
	$("#bonus-hint").html(buf);
	$("#bonus-hint tbody > tr").each(function() {
		var tr = this;
		if (hasClass(tr, "space")) return;
		var input = $("input", tr)[0];
		var m = /^bonus-hint-(\d)-(\d)$/.exec(tr.id);
		var n = Number(m[1]);
		var i = Number(m[2]);
		$(tr).click(function(e) {
			var td = get_parent_element(e.target, "td");
			if (!hasClass(td, "name")) {
				if (input) input.click();
			}
		});
		if (input) $(input).click(function(e) {
			disable_selected_tr(n);
			addClass(tr, "selected");
			$("#num_bonus").text(calc_num_bonus());
			change_select(n);
			e.stopPropagation();
		});
		$("select", tr).change(on_select_change).keypress(on_select_change);
		function on_select_change() {
			if (this.selectedIndex === 0) {
				removeClass(tr, "bonus");
				addClass(tr, "normal");
				candidates[n][i].selected_is_bonus = false;
			} else {
				removeClass(tr, "normal");
				addClass(tr, "bonus");
				candidates[n][i].selected_is_bonus = true;
			}
			change_select(n);
		}
	});
	$("#num_bonus").text(calc_num_bonus());
	

	function disable_selected_tr(n) {
		for (var i = 0; i < candidates[n].length; i ++) {
			removeClass(document.getElementById("bonus-hint-"+n+"-"+i), "selected");
		}
	}
	function build_rows(n, es, selected_entry) {
		var td = "<td rowspan=\""+(es.length)+"\" class=\"name\">"+selected_entry.pokemon.name;
		for (var i = 0; i < es.length; i ++) {
			buf += build_row(n, es, i, selected_entry, i === 0 ? td : "");
		}
	}
	function build_row(n, es, i, selected_entry, td) {
		var e = es[i].entry;
		var is_bonus = es[i].is_bonus;
		var selected_is_bonus = es[i].selected_is_bonus;
		var label = es[i].label;
		var selected = e === selected_entry;
		var status1 = get_status(limit_rank(shuu), is_open_level, e).join("-");
		var status2 = get_status(limit_rank(shuu + 1), is_open_level, e).join("-");
		var status;
		if (is_bonus === false) {
			status = status1;
		} else if (is_bonus === true) {
			status = status2;
		} else if (is_bonus === null) {
			status = "<select><option"+(!selected_is_bonus?" selected":"")+">"+status1+
			                 "<option"+( selected_is_bonus?" selected":"")+">"+status2+"</select>";
		} else {
			UNREACHABLE();
		}
		var id = "bonus-hint-"+n+"-"+i;
		var klass = (selected_is_bonus?"bonus":"normal")+(selected?" selected":"");
		var input = es.length > 1 ? "<input type=\"radio\" name=\"bonus-hint-radio-"+n+"\""+(selected?" checked":"")+">" : "";
		return "<tr id=\""+id+"\" class=\""+klass+"\">"+td+
		       "<td>"+input+label+
		       "<td>"+e.item+"<td>"+e.move+"<td class=\"status\">"+status+"</tr>";
	}
	function calc_num_bonus() {
		var num_bonus = 0;
		for (var i = 0; i < entries.length; i ++) {
			var index = get_selected_candidate_index(i);
			if (candidates[i][index].selected_is_bonus) {
				num_bonus ++;
			}
		}
		return num_bonus;
	}
	function change_select(n) {
		var index = get_selected_candidate_index(n);
		var candidate = candidates[n][index];
		var is_bonus = candidate.selected_is_bonus;
		var lines = textarea.value.split("\n");
		var i;
		for (i = 0; i < lines.length; i ++) {
			var m = /\S+/.exec(regularize_word(lines[i]));
			if (!m) continue;
			if (find_pokemon_entry(m[0]) !== candidate.entry.pokemon) continue;
			var m = /^\s*\S+((?:\s+(?:\d+|\?))?)/.exec(lines[i]);
			if (!m) continue;
			lines[i] = m[0];
			var entry_rank = is_bonus ? bonus_rank : rank;
			if (candidate.no !== null && entry_rank >= 8) {
				if (m[1] === "") lines[i] += " ?";
				lines[i] += " " + candidate.no;
			}
			if (is_bonus) {
				lines[i] += " b";
			}
			break;
		}
		textarea.value = lines.join("\n");
	}
	function get_selected_candidate_index(i) {
		if (candidates[i].length === 1) {
			return 0;
		}
		var form = document.forms.entries_form;
		return get_checked_radio_index(form["bonus-hint-radio-"+i]);
	}
	function gen_candidate(entry, is_bonus, label, no) {
		return {entry: entry,
		        is_bonus: is_bonus,
		        selected_is_bonus: null,
		        label: label,
		        no: no};
	}
	function update_last_data(shuu, is_open_level, text, entries, is_bonus_list) {
		last_data.shuu = shuu;
		last_data.is_open_level = is_open_level;
		last_data.text = text;
		last_data.entries = entries;
		last_data.is_bonus_list = is_bonus_list;
	}
}

function get_checked_radio_index(radios) {
	for (var i = 0; i < radios.length; i ++) {
		if (radios[i].checked) return i;
	}
	return null;
}


function build_result_div(shuu, is_open_level, is_hgss, seed, consumption,
                          num_bonus, input_by_seed, trainers_start_offset) {
	var div = document.getElementById("result");
	var r = get_6_entries_info(shuu, is_open_level, seed, consumption, num_bonus);
	var entries = r.entries;
	var seed_head = seed;
	var consumption_head = consumption;
	var entries_in_hand = entries.slice(0, 3);
	var back_seeds = trainers_start_offset !== null ? [] : 
	                    get_entries_back_seeds(shuu, is_open_level, r.raw_entries, seed_head, num_bonus);
	var trainers_candidate = get_trainers_candidate(seed_head, shuu, back_seeds, is_hgss);
	var trainers_index = get_selected_trainers_index(trainers_candidate, trainers_start_offset);
	var trainers = trainers_candidate[trainers_index];
	var trainer_ids = trainers.trainer_ids;
	context = {shuu: shuu,
	           is_open_level: is_open_level,
	           is_hgss: is_hgss,
	           infos: [r],
	           trainers: trainers_candidate,
	           selected_trainers_index: trainers_index};
	
	var buf = [];
	buf.push("<p>6匹決定時のseed: "+format_hex(seed_head, 8));
	if (back_seeds.length > 0) {
		buf.push(" (or "+map(back_seeds, function(i){return format_hex(step_seed(seed_head, -i), 8)}).join(", ")+")");
	}
	buf.push("</p>");
	buf.push("<p>最初の6匹 ");
	buf.push("<span id=\"range-0\" class=\"range\">"+rand_range_to_string(r)+"</span>");
	buf.push("<button id=\"paste-to-textarea\">この6匹を上のテキストボックスに入力</button>");
	buf.push("<button class=\"show-tooltip\" id=\"show-tooltip-0\">6匹決定の乱数列</button>");
	buf.push("</p>");
	buf.push("<div class=\"entries\" id=\"entries-0\">");
	buf.push(build_table(r.infos, 0, is_open_level));
	buf.push("</div>");
	buf.push("<p>選出:");
	for (var i = 0; i < 3; i ++) {
		buf.push("<br>　"+(i+1)+"匹目 <span id=\"election-"+i+"\">"+build_select(entries, i)+"</span>");
	}
	buf.push("</p>");
	if (trainers_candidate[0].is_dummy) {
		buf.push("<p><strong>このseedには対応するトレーナーの候補が見つかりません</strong>");
		if (is_influenced_by_trainers_shuu(shuu, is_open_level)) {
			buf.push("<br><small>以下は6戦目まですべて"+shuu+"周目のトレーナーとして表示しています</small>");
		}
		buf.push("</p>");
	} else {
		buf.push("<p>トレーナー: <br>");
		if (trainers_candidate.length >= 2 && is_influenced_by_trainers_shuu(shuu, is_open_level)) {
			buf.push("<strong>トレーナーのパターンの候補が複数あります。正しい候補を選ばないと結果がずれてきてしまいます</strong><br>");
		}
		buf.push(build_trainers_select(trainers_candidate, consumption_head, trainers_index));
	}
	for (var i = 1; i <= 7; i ++) {
		buf.push("<p>"+i+"戦目 <span id=\"trainer-name-"+i+"\"></span>");
		buf.push(" <span id=\"range-"+i+"\" class=\"range\"></span>");
		buf.push("<button class=\"show-tooltip\" id=\"show-tooltip-"+i+"\">3匹決定の乱数列</button>");
		buf.push("</p>");
		buf.push("<div class=\"entries\" id=\"entries-"+i+"\">");
		buf.push("</div>");
		if (i <= 6) {
			buf.push("<p style=\"margin-bottom:0\">交換: <span id=\"exchange-description-"+i+"\"></span></p>");
			buf.push("<table class=\"for-layout\">");
			buf.push("<tr><td style=\"text-align:right\">手放す<td id=\"exchange-part-"+i+"\"><td rowspan=\"2\"><button class=\"pokemon-select\" id=\"exchange-clear-"+i+"\">なし</button></td></tr>");
			buf.push("<tr><td style=\"text-align:right\">受け取る<td id=\"exchange-receive-"+i+"\"></tr>");
			buf.push("</table>");
		}
	}
	if (shuu === 3 || shuu === 7) {
		buf.push("<p>ネジキが言ってくるパーセント: <span id=\"nejiki-percent\"></span>%</p>");
	}
	buf.push("<p>ログ</p>");
	buf.push("<textarea id=\"result-log\" cols=\"60\" rows=\"10\"></textarea>");
	$(div).html(buf.join(""));
	update_trainer_names();
	change_enemy_entries0(0, entries_in_hand, r.seed, r.next_consumption);
	update_log_textarea();
	for (var i = 0; i < 3; i ++) {
		$("#election-"+i+" button").click(on_election_change);
	}
	for (var i = 1; i <= 6; i ++) {
		$("#exchange-clear-"+i).click(on_exchange_select_change);
	}
	$("#paste-to-textarea").click(paste_to_textarea);
	$("#trainers input").click(on_trainers_select_change);
	$("#result > div.entries > table > tbody > tr").mouseenter(on_mouseenter_tr).mouseleave(on_mouseleave_tr);
	$("button.show-tooltip").mouseenter(show_tooltip).mouseleave(hide_tooltip);
}

function change_enemy_entries(start, entries_in_hand) {
	// start戦後の交換フォームとそれ以降を書き換える
	// 0を指定すると1戦目の相手の手持ちから書き換え
	if (start > 0) context.infos[start].entries_in_hand = entries_in_hand;
	if (start < 7) {
		var r = context.infos[start + 1];
		change_enemy_entries0(start, entries_in_hand, r.seed_start, r.rand_range.first);
	}
	update_log_textarea();
}

function change_enemy_entries0(start, entries_in_hand, seed, consumption) {
	var prev_enemy_entries = start > 0 ? context.infos[start].entries : null;
	var shuu = context.shuu;
	var is_open_level = context.is_open_level;
	var is_hgss = context.is_hgss;
	var trainer_ids = get_selected_trainer_ids();
	var i = start;
	while (i <= 6) {
		if (i >= 1) {
			$("#exchange-part-"+i).html(build_select(entries_in_hand));
			$("#exchange-receive-"+i).html(build_select(prev_enemy_entries));
			$("#exchange-part-"+i+" button").click(on_exchange_select_change);
			$("#exchange-receive-"+i+" button").click(on_exchange_select_change);
			change_exchange_description(i);
		}
		i ++;
		var visited_entries = i === 1 ? context.infos[0].entries : entries_in_hand.concat(prev_enemy_entries);
		var trainer_id = trainer_ids[i-1];
		var rank = trainer_id_to_rank(trainer_id, is_open_level, is_hgss);
		var fixed_rank = fix_rank_enemy(rank, is_open_level);
		var r = get_3_entries_info(fixed_rank, seed, consumption, visited_entries, entries_in_hand);
		context.infos[i] = r;
		
		$("#range-"+i).text(rand_range_to_string(r));
		
		var div = document.getElementById("entries-"+i);
		$(div).html(build_table(r.infos, i, is_open_level));
		$("> table > tbody > tr", div).mouseenter(on_mouseenter_tr).mouseleave(on_mouseleave_tr);
		var c = get_enemy_consuption(shuu, i, rank);
		seed = step_seed(r.seed, c);
		consumption = r.next_consumption + c;
		prev_enemy_entries = r.entries;
	}
	if (shuu === 3 || shuu === 7) {
		$("#nejiki-percent").text(get_nejiki_percentage(seed));
	}
}

function change_exchange_description(i) {
	var entries_in_hand = context.infos[i].entries_in_hand;
	var enemy_entries = context.infos[i].entries;
	var part = get_selected_button_index($("#exchange-part-"+i)[0]);
	var receive = get_selected_button_index($("#exchange-receive-"+i)[0]);
	var text;
	var next_entries_in_hand = get_next_entries_in_hand(i);
	if (part !== -1 && receive !== -1) {
		text = entries_in_hand[part].name + "→" + enemy_entries[receive].name;
	} else {
		text = "なし";
	}
	text += " (" + map(next_entries_in_hand, "name").join(" ") + ")";
	$("#exchange-description-"+i).text(text);
}

function rand_range_to_string(r) {
	return r.rand_range.first+"-"+r.rand_range.last;
}

function get_nejiki_percentage(seed) {
	// thanks) http://schiphol.2ch.net/test/read.cgi/gameurawaza/1228689195/125
	return (seed >>> 16) % 90 + 10;
}

function get_selected_trainers() {
	return context.trainers[context.selected_trainers_index];
}

function get_selected_trainer_ids() {
	return get_selected_trainers().trainer_ids;
}

function get_trainers_candidate(seed_head, shuu, back_seeds, is_hgss) {
	var i = 13;
	var seed = step_seed(seed_head, -i);
	var result = [];
	back_seeds = back_seeds.concat(0); // Array#concatは破壊的ではないので引数の配列を変更していない
	while (i < 50) {
		// 50個前のseedまで決めうちで遡るってのはダサいけどきちんとループの終了条件を確かめるのは面倒なので
		var r = get_trainers_by_seed(shuu, seed, is_hgss);
		if (ary_include(back_seeds, i - r.consumption)) {
			result.push({start: -i,
			             seed: seed,
			             c: r.c,
			             trainer_ids: r.trainer_ids,
			             trainer_ids2: r.trainer_ids2,
			             is_dummy: false});
		}
		i ++;
		seed = prev_seed(seed);
	}
	if (result.length === 0) {
		result.push(gen_dummy_trainers(shuu));
	}
	return result;
}

function gen_dummy_trainers(shuu) {
	var ids = [];
	for (var i = 0; i < 6; i ++) {
		ids.push(get_dummy_trainer_id(shuu));
	}
	if (shuu === 3) {
		ids.push(silver_nejiki_id);
	} else if (shuu === 7) {
		ids.push(gold_nejiki_id);
	} else {
		ids.push(get_dummy_trainer_id(shuu + 1));
	}
	return {start: null, c: null, trainer_ids: ids, is_dummy: true};
}

function get_selected_trainers_index(candidate, start_offset) {
	if (start_offset === null) {
		return 0;
	}
	for (var i = 0; i < candidate.length; i ++) {
		if (candidate[i].start === start_offset) {
			return i;
		}
	}
	throw new Error("trainers_candidate not found");
}

function build_trainers_select(trainers_canndidate, consumption, selected_index) {
	var buf = "<span id=\"trainers\">";
	for (var i = 0; i < trainers_canndidate.length; i ++) {
		buf += "<label><input type=\"radio\" name=\"trainers-select\" value=\""+i+"\""+(selected_index===i?" checked":"")+">"+
		       trainers_to_string(trainers_canndidate[i], consumption)+
		       " ("+format_hex(trainers_canndidate[i].seed, 8)+")</label><br>";
	}
	buf += "</span>";
	return buf;
}

function trainers_to_string(trainers, consumption) {
	return (trainers.start+consumption)+".."+(trainers.start+trainers.c-1+consumption)+": "+
	        map(trainers.trainer_ids, trainer_id_to_name).join(", ");
}

// 相手の3匹決定後の乱数消費量を取得
function get_enemy_consuption(shuu, nth, enemy_rank) {
	var c;
	if (shuu >= 5) {
		c = 24;
	} else if(enemy_rank === 1) {
		c = 6;
	} else {
		c = 12;
	}
	if (nth === 1) {
		c += shuu === 1 ? 18 : 36;
	}
	return c;
}

function trainer_id_to_name(i) {
	return /の([^の]+)$/.exec(trainer_names[i])[1];
}

function get_entries_back_seeds(shuu, is_open_level, entries, seed_base, num_bonus) {
	// 乱数列を遡ってみて最初の6匹が同じ結果になるseedを探す
	// A A B C D E F のように並んでいる場合はもちろん
	// A B A B C D E F, A X A B C D E F (XはAとアイテムが同じポケモン) のようなパターンも見つける
	
	var first_rank = fix_rank(num_bonus === 6 ? shuu + 1 : shuu, is_open_level);
	var result = [];
	var seed = seed_base;
	var i = 0;
	while (true) {
		seed = prev_seed(seed);
		i ++;
		var e = seed_to_entry(first_rank, seed);
		if (!entries_collision0(e, entries)) break;
		if (is_match(seed)) {
			result.push(i);
		}
	}
	return result;
	function is_match(seed) {
		var es = [];
		var i = 0;
		while (seed !== seed_base) {
			var e = seed_to_entry(first_rank, seed);
			seed = next_seed(seed);
			if (entries_collision0(e, es)) continue;
			if (e !== entries[i]) return false;
			es[i] = e;
			i ++;
		}
		return true;
	}
}

function is_influenced_by_trainers_shuu(shuu, is_open_level) {
	// 6戦目までの相手の手持ちがトレーナーの種類に影響される周か
	// 9周目からは前のランクも今のランクも手持ちが変わらない
	return shuu !== 1 && fix_rank(shuu, is_open_level) < 9;
}

function read_int_string(s, default_value) {
	s = regularize_word(s);
	if (/^\s*$/.test(s) && default_value !== undefined) {
		return default_value;
	}
	if (!/^\s*(?:-?\d+|0x[0-9a-f]+)\s*$/i.test(s)) {
		return null;
	}
	return Number(s);
}

function parse_text(shuu, is_open_level, text) {
	var lines = regularize_word(text).split("\n");
	var entries = [];
	var pokemons = [];
	var parent_ids = [];
	var is_bonus_list = [];
	var rank = fix_rank(shuu, is_open_level);
	var bonus_rank = fix_rank(shuu + 1, is_open_level);
	var errors = [];
	var count = 0;
	var invalid_line = false;
	for (var i = 0; i < lines.length; i ++) {
		var line = lines[i];
		if (/^\s*$/.test(line)) continue;
		// ポケモン名 [親ID] [何番目] [b]
		// 何番目: 何番目の候補か (オープンレベル4周目以降で必要になる)
		// b: ボーナスポケモン指定
		// 親IDを省略して「何番目」を指定した場合、「何番目」が親IDとして認識されてしまうので
		// 親IDの代わりに "?" を指定できるようにしてある
		var m = /^\s*(\S+)((?:\s+(?:\d+|\?))?)((?:\s+\d)?)((?:\s+b)?)\s*$/.exec(line);
		if (!m) {
			errors.push((i+1)+"行目が不正です > "+line);
			invalid_line = true;
			continue;
		}
		count ++;
		var name = m[1], parent_id = read_int_string(m[2]), no = Number(m[3]), is_bonus = m[4] !== "";
		var pokemon = find_pokemon_entry(name);
		if (parent_id !== null && (parent_id < 0 || parent_id >= 65536)) {
			errors.push((i+1)+"行目: "+parent_id+"は不正なIDです");
		}
		if (!pokemon) {
			errors.push((i+1)+"行目: \""+name+"\"は存在しません");
			continue;
		}
		if (!exist_pokemon_in_rank(rank, pokemon)) {
			errors.push((i+1)+"行目: "+pokemon.name+"は"+shuu+"周目に存在しません");
			continue;
		}
		if (rank < 7) {
			no = null; // 7周目(オープン4周目)までは「何番目」は関係ない
		} else if (m[3] === "") {
			if (pokemon.group === 4) {
				no = 1; // 準伝説なら1番目がデフォルトの候補
			} else if (pokemon.group === 3) {
				if (is_open_level && shuu <= 7) {
					no = 3; // 3番目(ランク6)がデフォルトの候補 (1,2番目は出ず、3,4番目しか出ないため）
				} else {
					no = 1;
				}
			} else {
				UNREACHABLE();
			}
		}
		if (no !== null && !(1 <= no && no <= 4)) {
			errors.push((i+1)+"行目: "+no+"番目は存在しません");
			continue;
		}
		// オープンレベル4周目から6周目までは1,2番目の候補は出てこない
		if (is_open_level && 4 <= shuu && shuu < 7 && pokemon.group === 3 && no <= 2) {
			errors.push((i+1)+"行目: "+no+"番目は存在しません");
			continue;
		}
		var entry;
		if (is_bonus) {
			entry = pokemon_to_entry(bonus_rank, pokemon, no);
			if (!entry) {
				errors.push((i+1)+"行目: "+pokemon.name+"は"+shuu+"周目のボーナスに存在しません");
				continue;
			}
		} else {
			entry = pokemon_to_entry(rank, pokemon, no);
			if (!entry) {
				is_bonus = true;
				entry = pokemon_to_entry(bonus_rank, pokemon, no);
			}
		}
		if (ary_include(pokemons, pokemon)) {
			errors.push((i+1)+"行目: "+pokemon.name+"が重複しています");
		} else if (entries_collision0(entry, entries)) {
			errors.push((i+1)+"行目: "+pokemon.name+"はアイテムが重複しています");
		}
		pokemons.push(pokemon);
		entries.push(entry);
		parent_ids.push(parent_id);
		is_bonus_list.push(is_bonus);
	}
	if (!invalid_line) {
		if (count > 6) {
			errors.push("6匹より多く入力されています");
		} else if (count < 6) {
			errors.push("6匹入力されていません");
		}
	}
	return {entries: entries,
	        parent_ids: parent_ids,
	        is_bonus_list: is_bonus_list,
	        errors: errors};
}

var LEGEND_START_ID = rank_entries_end[7] + 1;
var LEGEND_NUM = 14; // 準伝説1セットの数 (ランク7のポケモンの後ろに4セットある)

function pokemon_to_entry(rank, pokemon, no) {
	var group = pokemon.group;
	var id_in_group = pokemon.id_in_group;
	if (group === null) return null;
	if (!match_rank_and_group(rank, group)) return null;
	if (rank >= 8) {
		if (!(1 <= no && no <= 4)) return null;
		if (group === 4) { // 準伝説
			return factory_data[LEGEND_START_ID + (no - 1) * LEGEND_NUM + id_in_group];
		} else {
			return factory_data[rank_entries_start[3 + no] + id_in_group];
		}
	} else { // ランク7以下は引数noは無視
		return factory_data[rank_entries_start[rank] + id_in_group];
	}
}

function entry_to_no(entry) {
	if (entry.pokemon.group === 4) { // 準伝説
		var i = entry.id - LEGEND_START_ID;
		return Math.floor(i / LEGEND_NUM) + 1;
	} else if (entry.pokemon.group === 3) {
		return entry_id_to_rank(entry.id) - 3;
	} else {
		UNREACHABLE();
	}
}

function get_legend_entry(pokemon, no) {
	var id_in_group = pokemon.id_in_group;
	return factory_data[LEGEND_START_ID + no * LEGEND_NUM + id_in_group];
}

function match_rank_and_group(rank, group) {
	if (group === 1) return rank === 1;
	if (group === 2) return rank === 2 || rank === 3;
	if (group === 3) return rank >= 4;
	if (group === 4) return rank >= 8;
	UNREACHABLE();
}

// ポケモンが指定した周の最初の6匹に存在しえるか (ボーナスポケモンも含めて)
function exist_pokemon_in_rank(shuu, pokemon) {
	var group = pokemon.group;
	if (group === null) return false;
	return match_rank_and_group(shuu, group) || match_rank_and_group(shuu + 1, group);
}

function entry_id_to_rank(id) {
	for (var i = 1; i <= 7; i ++) {
		if (id <= rank_entries_end[i]) return i;
	}
	return 8;
}

function on_election_change(ev) {
	if (Lock.is_locked()) return;
	var button = this;
	var changed_index = /^election-(\d)$/.exec(button.parentNode.id)[1];
	$("button.selected", button.parentNode).removeClass("selected");
	addClass(button, "selected");
	var shuu = context.shuu;
	var six_entries = context.infos[0].entries;
	var entries_in_hand = [];
	for (var i = 0; i < 3; i ++) {
		var parent = document.getElementById("election-"+i);
		var index = get_selected_button_index(parent);
		var entry = six_entries[index];
		entries_in_hand.push(entry);
	}
	if (!ary_eq(context.infos[1].entries_in_hand, entries_in_hand)) {
		// 体感速度を上げるため、先にボタンの色を反映させてから遅延して内容を更新する
		Lock.setTimeout(function() {
			change_enemy_entries(1, entries_in_hand);
		}, 0);
	}
}

function on_exchange_select_change() {
	if (Lock.is_locked()) return;
	var button = this;
	var m = /^exchange-clear-(\d)$/.exec(button.id);
	var n;
	if (m) {
		n = Number(m[1]);
		$("#exchange-part-"+n+" button.selected").removeClass("selected");
		$("#exchange-receive-"+n+" button.selected").removeClass("selected");
	} else {
		n = Number(/^exchange-(?:part|receive)-(\d)/.exec(this.parentNode.id)[1]);
		$("button.selected", button.parentNode).removeClass("selected");
		addClass(button, "selected");
	}
	var next_entries_in_hand = get_next_entries_in_hand(n);
	if (!ary_eq(context.infos[n + 1].entries_in_hand, next_entries_in_hand)) {
		change_exchange_description(n);
		Lock.setTimeout(function() {
			change_enemy_entries(n + 1, next_entries_in_hand);
		}, 0);
	}
}

function on_trainers_select_change() {
	if (Lock.is_locked()) return;
	context.selected_trainers_index = Number(this.value);
	update_trainer_names();
	change_enemy_entries(0, context.infos[1].entries_in_hand);
}

function update_trainer_names() {
	var ids = get_selected_trainer_ids();
	for (var i = 1; i <= 7; i ++) {
		$("#trainer-name-"+i).text(trainer_names[ids[i-1]]);
	}
}

function update_log_textarea() {
	var buf = [];
	buf.push((context.is_hgss ? "HGSS" : "プラチナ")+" "+
	         (context.is_open_level ? "オープンレベル" : "Lv50")+" "+
	         context.shuu+"周目");
	buf.push(format_hex(context.infos[0].seed_start, 8)+" (ボーナスポケ:"+context.infos[0].num_bonus + ")");
	var trainers = get_selected_trainers();
	if (trainers.is_dummy) {
		buf.push("トレーナー: none");
	} else {
		buf.push(trainers_to_string(trainers, 0));
	}
	buf.push("選出: "+map(context.infos[1].entries_in_hand, "name").join(","));
	for (var i = 1; i <= 6; i ++) {
		var part_index = get_selected_button_index($("#exchange-part-"+i)[0]);
		var receive_index = get_selected_button_index($("#exchange-receive-"+i)[0]);
		if (part_index !== -1 && receive_index !== -1) {
			var part = context.infos[i].entries_in_hand[part_index];
			var receive = context.infos[i].entries[receive_index];
			buf.push(i+"戦目後: "+part.name+"→"+receive.name);
		}
	}
	$("#result-log").val(buf.join("\n"));
}

function get_next_entries_in_hand(i) {
	var entries_in_hand = context.infos[i].entries_in_hand.slice();
	var enemy_entries = context.infos[i].entries;
	var part = get_selected_button_index($("#exchange-part-"+i)[0]);
	var receive = get_selected_button_index($("#exchange-receive-"+i)[0]);
	if (part !== -1 && receive !== -1) {
		entries_in_hand[part] = enemy_entries[receive];
	}
	return entries_in_hand;
}

function get_selected_button_index(parent) {
	var buttons = $("button", parent);
	for (var i = 0; i < buttons.length; i ++) {
		if (hasClass(buttons[i], "selected")) {
			return i;
		}
	}
	return -1;
}

function build_select(entries, selectedIndex) {
	var buf = "";
	for (var i = 0; i < entries.length; i ++) {
		var klass = selectedIndex === i ? " selected" : "";
		buf += "<button class=\"pokemon-select"+klass+"\">"+entries[i].name+"</button>";
	}
	return buf;
}

function build_table(info, nth, is_open_level) {
	var buf = [];
	buf.push("<table><thead><tr><th>周<th>No<th>名前<th>アイテム<th>特性<th>性別<th>ID<th>裏ID<th>性格値</tr></thead>");
	buf.push("<tbody>");
	for (var i = 0; i < info.length; i ++) {
		var e = info[i];
		var pid = e.pid;
		var entry = e.entry;
		var shuu = unfix_rank(entry_id_to_rank(entry.id), is_open_level);
		buf.push("<tr id=\"entry-"+nth+"-"+i+"\">"+
		         "<td>"+shuu+
		         "<td>"+(entry.id+1)+
		         "<td>"+entry.name+
		         "<td>"+entry.item+
		         "<td>"+entry.pokemon.abilities[pid % 2]+
		         "<td>"+pid2gender(pid, entry.pokemon)+
		         "<td>"+format_dec(e.parent_id, 5)+
		         "<td>"+format_dec(e.secret_id, 5)+
		         "<td>"+format_hex(pid, 8)+"</tr>");
	}
	buf.push("</tbody></table>");
	return buf.join("");
}

function paste_to_textarea() {
	var shuu = context.shuu;
	var is_open_level = context.is_open_level;
	var rank = fix_rank(shuu, is_open_level);
	var bonus_rank = fix_rank(shuu + 1, is_open_level);
	var infos = context.infos[0].infos;
	var buf = "";
	for (var i = 0; i < 6; i ++) {
		if (i > 0) buf += "\n";
		buf += infos[i].entry.name + " " + format_dec(infos[i].parent_id, 5);
		var entry_shuu = infos[i].is_bonus ? bonus_rank : rank;
		if (entry_shuu >= 8) {
			buf += " " + entry_to_no(infos[i].entry);
		}
		if (infos[i].is_bonus) {
			buf += " b";
		}
	}
	document.forms.entries_form.entries.value = buf;
	document.getElementById("shuu_input").value = shuu;
	set_form_level(is_open_level);
	update_bonus_hint();
}

function set_form_level(is_open_level) {
	var radios = document.forms.shuu_form.level;
	var value = is_open_level ? "100" : "50";
	for (var i = 0; i < radios.length; i ++) {
		if (radios[i].value === value) {
			radios[i].checked = true;
			break;
		}
	}
}

function show_tooltip() {
	var button = this;
	var n = Number(/^show-tooltip-(\d)$/.exec(button.id)[1]);
	var tooltip = document.getElementById("tooltip-"+n);
	if (tooltip) {
		$(tooltip).html(get_tooltip_content(n));
		tooltip.style.display = "";
		resize_tooltip(button, tooltip);
		return;
	}
	tooltip = $("<div id=\"tooltip-"+n+"\" class=\"tooltip\"></div>")
	           .html(get_tooltip_content(n))[0];
	$("#result").append(tooltip);
	resize_tooltip(button, tooltip);
	$(tooltip).mouseleave(function(ev) {
		if (ev.relatedTarget !== button) {
			tooltip.style.display = "none";
		}
	});
}

function get_tooltip_content(nth) {
	var info = context.infos[nth];
	var is_open_level = context.is_open_level;
	var rank = info.rank;
	var bonus_rank = info.bonus_rank;
	var seed = info.seed_start;
	var consumption = info.rand_range.first;
	var n = info.entries.length;
	var visited_entries = info.visited_entries;
	var num_bonus = info.num_bonus;
	var i = 0;
	var entries = [];
	var r = [];
	while (i < n) {
		var is_bonus = n - i <= num_bonus;
		var entry_rank = is_bonus ? bonus_rank : rank;
		var count = rank_entries_count[entry_rank];
		var start = rank_entries_start[entry_rank];
		var id = count + start - 1 - (seed >>> 16) % count;
		var entry = factory_data[id];
		var collided_entry = find_collided_entry(entry, entries, visited_entries);
		
		r.push({seed: seed, count: count, start: start, id: id, entry: entry, collided_entry: collided_entry});
		seed = next_seed(seed);
		if (collided_entry) continue;
		entries.push(entry);
		i ++;
	}
	var buf = "<pre>";
	var prec = Math.max(String(consumption).length, String(consumption + r.length - 1).length);
	for (var i = 0; i < r.length; i ++) {
		var e = r[i];
		if (i >= 0) buf += "\n";
		if (e.collided_entry) buf += "<span class=\"collided\">";
		buf += format_dec(consumption + i, prec, " ") + " (" + format_hex(e.seed, 8) + "): " +
		       format_dec(e.count + e.start, 3, " ") + " - " + format_hex(e.seed >>> 16, 4) + " % " + 
		       format_dec(e.count, 3, " ") + " = " + 
		       format_dec(e.id + 1, 3, " ") + " " + rjust_name(e.entry.name) + " (" + e.entry.item + ")";
		if (e.collided_entry) buf += "</span>";
	}
	buf += "</pre>"
	return buf;
}

function resize_tooltip(button, tooltip) {
	var width = tooltip.offsetWidth;
	var height = tooltip.offsetHeight;
	var offset = $(button).offset();
	var scrollTop  = document.body.scrollTop  || document.documentElement.scrollTop;
	// ボタンの上に表示するスペースがなければボタンの下に表示
	if (offset.top - height >= scrollTop) {
		tooltip.style.top = (offset.top - height) + "px";
	} else {
		tooltip.style.top = (offset.top + button.offsetHeight) + "px";
	}
	tooltip.style.left = Math.max(offset.left + button.offsetWidth + 20 - width, 4) + "px";
}

function hide_tooltip(ev) {
	var button = this;
	var n = /^show-tooltip-(\d)$/.exec(button.id)[1];
	var tooltip = document.getElementById("tooltip-"+n);
	if (!tooltip) return;
	if (ev.relatedTarget === tooltip) return;
	tooltip.style.display = "none";
}

function on_mouseenter_tr(ev) {
	var tr = this;
	if (hasClass(tr, "entry-detail")) return;
	if (tr.nextSibling && hasClass(tr.nextSibling, "entry-detail")) {
		if (tr.nextSibling.style.display === "none") {
			tr.nextSibling.style.display = "";
			set_tr_rowspan(tr, 2);
		}
		return;
	}
	var detail_tr = $("<tr class=\"entry-detail\"></tr>").html("<td colspan=\"6\">"+build_entry_detail(tr)+"</td>");
	detail_tr.mouseleave(on_mouseleave_detail_tr);
	$(tr).after(detail_tr);
	set_tr_rowspan(tr, 2);
}

function set_tr_rowspan(tr, n) {
	for (var i = 0; i < 3; i ++) {
		tr.childNodes[i].setAttribute("rowSpan", n);
	}
}

function on_mouseleave_tr(ev) {
	var tr = this;
	if (tr.parentNode.tagName.toUpperCase() !== "TBODY") return;
	if (tr.nextSibling && hasClass(tr.nextSibling, "entry-detail")) {
		if (!elementWithIn(tr.nextSibling, ev.relatedTarget)) {
			remove_detail_tr(tr);
		}
	}
}

function remove_detail_tr(tr) {
	tr.nextSibling.style.display = "none";
	set_tr_rowspan(tr, 1);
}

function on_mouseleave_detail_tr(ev) {
	var tr = this.previousSibling;
	if (!elementWithIn(tr, ev.relatedTarget)) {
		remove_detail_tr(tr);
	}
}

function build_entry_detail(tr) {
	var m = /^entry-(\d)-(\d)$/.exec(tr.id);
	var i = Number(m[1]);
	var j = Number(m[2]);
	var entry = context.infos[i].entries[j];
	var is_open_level = context.is_open_level;
	var rank = get_enemy_entry_rank(i, j);
	var individual = get_individual_by_rank(rank);
	var buf = "<small>";
	buf += "性格: "+natures[entry.nature]+" 努力値: "+entry.effort+" 個体値: "+individual+"<br>";
	buf += "技: "+entry.move+"<br>";
	buf += "ステータス: "+get_status(rank, is_open_level, entry).join("-");
	buf += "</small>"
	return buf;
}

function get_enemy_entry_rank(nth, i) {
	// nth戦目のi匹目のランクを取得 (fix_rankされていない値)
	// 最初の6匹の場合 nth=0
	if (nth > 0) {
		var trainer_id = get_selected_trainer_ids()[nth-1];
		return trainer_id_to_rank(trainer_id, context.is_open_level, context.is_hgss);
	} else {
		if (context.infos[0].infos[i].is_bonus) {
			return limit_rank(context.shuu + 1);
		} else {
			return limit_rank(context.shuu);
		}
	}
}

function get_individual_by_rank(rank) {
	if (rank <= 7) {
		return (rank - 1) * 4;
	}
	switch(rank) {
	case RANK_8_LV50:
	case RANK_8_OPEN:
	case RANK_8_ENEMY:
	case RANK_OPEN_8:
		return 31;
	case RANK_OPEN_SILVER_NEJIKI_PT:
	case RANK_OPEN_SILVER_NEJIKI_HGSS:
		return 12;
	case RANK_LV50_GOLD_NEJIKI_PT:
	case RANK_LV50_GOLD_NEJIKI_HGSS:
	case RANK_OPEN_GOLD_NEJIKI:
		return 31;
	default:
		UNREACHABLE();
	}
}

var nature_table = new Array(25);
(function() {
	var fix = [0, 1, 4, 2, 3]; // HABSCD順をHABCDS順に
	for (var i = 0; i < 25; i ++) {
		var row = [10, 10, 10, 10, 10];
		row[fix[i / 5 | 0]] ++;
		row[fix[i % 5]] --;
		nature_table[i] = row;
	}
})();

var status_names = "HP,攻撃,防御,特攻,特防,すば".split(",");

function omit_effort_text(text) {
	// ex. omit_effort_text("HP/攻撃")
	//  => "HA"
	var list = text.split("/");
	var result = "";
	for (var i = 0; i < list.length; i ++) {
		result += "HABCDS".charAt(indexof(status_names, list[i]));
	}
	return result;
}

function effort_text_to_array(text) {
	// ex. effort_text_to_array("HA")
	//  => [255, 255, 0, 0, 0, 0]
	var t = "HABCDS";
	var efforts = [0, 0, 0, 0, 0, 0];
	for (var i = 0; i < text.length; i ++) {
		efforts[t.indexOf(text.charAt(i))] = text.length === 3 ? 170 : 255;
	}
	return efforts;
}

function get_status(rank, is_open_level, entry) {
	// ex. get_status(1, false, find_factory_entry(1, "フシギダネ"))
	// => [105, 48, 54, 111, 101, 50]
	// 注) rankはfix_rankされていない値
	var lv = is_open_level ? 100 : 50;
	var individual = get_individual_by_rank(rank);
	var stats = entry.pokemon.stats;
	var efforts = effort_text_to_array(entry.effort);
	var hp = calc_status_hp(lv, stats[0], individual, efforts[0]);
	if (stats[0] === 1) hp = 1; // ヌケニン
	var result = [hp];
	var nature_revisions = nature_table[entry.nature];
	for (var i = 0; i < 5; i ++) {
		result.push(calc_status(lv, stats[i + 1], individual, efforts[i + 1], nature_revisions[i]));
	}
	return result;
}

function calc_status_hp(lv, base, individual, effort) {
	return Math.floor((base * 2 + Math.floor(effort / 4) + individual) * lv / 100) + lv + 10;
}

function calc_status(lv, base, individual, effort, nature_revision) {
	return Math.floor((Math.floor((base * 2 + Math.floor(effort / 4) + individual) * lv / 100) + 5) * nature_revision / 10);
}

function get_pokemon_entry(name) {
	return pokemon_data[pokemon_name2id[name]];
}

function pid2gender(pid, pokemon) {
	var boundary = pokemon.gender_boundary;
	if (boundary !== null) {
		return (pid & 0xff) > boundary ? "♂" : "♀";
	} else {
		return "不明";
	}
}

function get_trainers_by_seed(shuu, seed, is_hgss) {
	// トレーナーA
	var r = get_trainers_by_seed0(shuu, seed, 7, [], true);
	// トレーナーB
	//   2周目と6周目は6人分しか決定しない
	//   プラチナでは7人目も6人目までと同じ決定方法
	var r2 = get_trainers_by_seed0(shuu, step_seed(seed, r.c),
	                               (shuu === 2 || shuu === 6) ? 6 : 7, r.trainer_ids,
	                               is_hgss);
	return {trainer_ids: r.trainer_ids,
	        trainer_ids2: r2.trainer_ids,
	        c: r.c,
	        consumption: r.c + r2.c};
}

function get_trainers_by_seed0(shuu, seed, num, visited, is_last_trainer_next_rank) {
	var result = [];
	var c = 0;
	var i = 1;
	while (i <= num) {
		if ((shuu === 3 || shuu === 7) && i === 7 && visited.length === 0) {
			result.push(shuu === 3 ? silver_nejiki_id : gold_nejiki_id);
			break;
		}
		var e = seed_to_trainer_id(shuu, is_last_trainer_next_rank && i === 7, seed);
		seed = next_seed(seed);
		c ++;
		if (ary_include(result, e) || ary_include(visited, e)) continue;
		result.push(e);
		i ++;
	}
	return {trainer_ids: result, c: c};
}

function seed_to_trainer_id(shuu, is_last, seed) {
	var r = seed >>> 16;
	if (shuu >= 8) {
		return r % 99 + 200;
	} else if (is_last) {
		return r % 19 + 100 + (shuu - 1) * 20;
	} else if (shuu === 1) {
		return r % 99;
	} else {
		return r % 39 + 80 + (shuu - 2) * 20;
	}
}

function trainer_id_to_rank(id, is_open_level, is_hgss) {
	if (id < 0) UNREACHABLE();
	if (id <= 99) return 1;
	if (id <= 119) return 2;
	if (id <= 139) return 3;
	if (id <= 159) return 4;
	if (id <= 179) return 5;
	if (id <= 199) return 6;
	if (id <= 219) return 7;
	if (id <= 299) return RANK_8_ENEMY;
	if (id === silver_nejiki_id) {
		if (is_open_level) {
			return is_hgss ? RANK_OPEN_SILVER_NEJIKI_HGSS : RANK_OPEN_SILVER_NEJIKI_PT;
		} else {
			return 4;
		}
	}
	if (id === gold_nejiki_id) {
		if (is_open_level) {
			return RANK_OPEN_GOLD_NEJIKI;
		} else {
			return is_hgss ? RANK_LV50_GOLD_NEJIKI_HGSS : RANK_LV50_GOLD_NEJIKI_PT;
		}
	}
	if (id >= dummy_trainer_start_id) {
		var rank = (id - dummy_trainer_start_id) + 1;
		if (rank === 8) rank = RANK_8_ENEMY;
		return rank;
	}
	UNREACHABLE();
}

function seed_to_entry(rank, seed) {
	return factory_data[seed_to_entry_id(rank, seed)];
}

function seed_to_entry_id(rank, seed) {
	var count = rank_entries_count[rank];
	var end   = rank_entries_end[rank];
	return end - (seed >>> 16) % count;
}

function get_3_entries_info(rank, seed, consumption, visited_entries, entries_in_hand) {
	return get_entries_info(rank, null, seed, consumption, 3, visited_entries, entries_in_hand, 0);
}

function get_6_entries_info(shuu, is_open_level, seed, consumption, num_bonus) {
	var rank = fix_rank(shuu, is_open_level);
	var bonus_rank = fix_rank(shuu + 1, is_open_level);
	return get_entries_info(rank, bonus_rank, seed, consumption, 6, [], null, num_bonus);
}

function get_entries_info(rank, bonus_rank, seed, consumption, num, visited_entries, entries_in_hand, num_bonus) {
	var entries = [];
	var infos = [];
	var i = 0;
	var seed_start = seed;
	var c = consumption;
	while (i < num) {
		var is_bonus = num - i <= num_bonus;
		var entry_rank = is_bonus ? bonus_rank : rank;
		var entry = seed_to_entry(entry_rank, seed);
		seed = next_seed(seed); c ++;
		if (entries_collision(entry, entries, visited_entries)) continue;
		entries.push(entry);
		infos.push({entry: entries[i],
		            parent_id: null,
		            secret_id: null,
		            pid: null,
		            is_bonus: is_bonus});
		i ++;
	}
	
	for (var i = 0; i < num; i ++) {
		var parent_id = seed >>> 16;
		seed = next_seed(seed); c ++;
		var secret_id = seed >>> 16;
		seed = next_seed(seed); c ++;
		var nature = entries[i].nature;
		do {
			var pid_low = seed >>> 16;
			seed = next_seed(seed); c ++;
			var pid_high = seed >>> 16;
			seed = next_seed(seed); c ++;
			var pid = (pid_high << 16 | pid_low) >>> 0;
		} while (pid % 25 !== nature || is_shiny_pid(parent_id, secret_id, pid));
		infos[i].parent_id = parent_id;
		infos[i].secret_id = secret_id;
		infos[i].pid = pid;
	}
	
	var range = {first: consumption, last: c - 1};
	
	var raw_entries = entries;
	if (num === 6) {
		entries = entries.slice();
		var swap1 = (seed >>> 16) % 6;
		seed = next_seed(seed); c ++;
		var swap2 = (seed >>> 16) % 6;
		seed = next_seed(seed); c ++;
		
		ary_swap(infos, 4, swap1);
		ary_swap(infos, 5, swap2);
		
		ary_swap(entries, 4, swap1);
		ary_swap(entries, 5, swap2);
	}
	
	return {entries: entries,
	        raw_entries: raw_entries,
	        infos: infos,
	        seed: seed,
	        seed_start: seed_start,
	        rand_range: range,
	        next_consumption: c,
	        entries_in_hand: entries_in_hand,
	        visited_entries: visited_entries,
	        rank: rank,
	        bonus_rank: bonus_rank,
	        num_bonus: num_bonus};
}

function entries_collision(entry, entries, visited_entries) {
	return entries_collision0(entry, entries) || entries_collision0(entry, visited_entries);
}

function entries_collision0(entry, entries) {
	for (var i = 0; i < entries.length; i ++) {
		if (entry.pokemon === entries[i].pokemon) return true;
		if (entry.item === entries[i].item) return true;
	}
	return false;
}

function find_collided_entry(entry, entries, visited_entries) {
	return find_collided_entry0(entry, entries) || find_collided_entry0(entry, visited_entries);
}

function find_collided_entry0(entry, entries) {
	for (var i = 0; i < entries.length; i ++) {
		if (entry.pokemon === entries[i].pokemon) return entry;
		if (entry.item === entries[i].item) return entry;
	}
	return null;
}

function FindSeedProcedure(shuu, is_open_level, entries, parent_ids, is_bonus_list) {
	this.entries = entries;
	this.parent_ids = parent_ids;
	this.is_bonus_list = is_bonus_list;
	this.items = map(entries, "item");
	this.pokemons = map(entries, "pokemon");
	this.bonus_entries = FindSeedProcedure.gen_bonus_entries(entries, is_bonus_list);
	if (this.bonus_entries.length === 6) {
		this.bonus_entries = [];
		shuu += 1;
	}
	this.rank = fix_rank(shuu, is_open_level);
	this.bonus_rank = fix_rank(shuu + 1, is_open_level);
	
	this.num_bonus = this.bonus_entries.length;
	this.last_candidate_entries = this.num_bonus > 0 ? this.bonus_entries : this.entries;
	this.last_entry_rank = this.num_bonus > 0 ? this.bonus_rank : this.rank;
	this.ns = FindSeedProcedure.gen_ns(is_bonus_list, parent_ids);
	this.i = 0;
	this.j = 0;
}

FindSeedProcedure.gen_bonus_entries = function(entries, is_bonus_list) {
	var result = [];
	for (var i = 0; i < 6; i ++) {
		if (is_bonus_list[i]) result.push(entries[i]);
	}
	return result;
};

FindSeedProcedure.gen_ns = function(is_bonus_list, parent_ids) {
	var _ns = [0, 4, 5];
	var ns = [];
	for (var i = 0; i < 3; i ++) {
		var n = _ns[i];
		// ボーナスポケモンは先頭になるはずがないので除外
		if (!is_bonus_list[n] && parent_ids[n] !== null) {
			ns.push(n);
		}
	}
	return ns;
};

FindSeedProcedure.prototype.run = function(timeout) {
	var start_time = + new Date;
	var start_i = this.i;
	for (; this.i < this.ns.length; this.i ++) {
		var n = this.ns[this.i];
		var entry = this.entries[n];
		var parent_id = this.parent_ids[n];
		var j = this.i === start_i ? this.j : 0;
		for (; j < 65536; j ++) {
			var seed = (parent_id << 16 | j) >>> 0;
			seed_head = this.match_entries(seed, entry);
			if (seed_head !== null) return seed_head;
			if ((j & 255) === 0 && new Date - start_time >= timeout) {
				this.j = j + 1;
				return "timeout";
			}
		}
	}
	return null;
};

FindSeedProcedure.prototype.get_ratio = function() {
	return (this.i * 65536 + this.j) / (this.ns.length * 65536);
}

FindSeedProcedure.prototype.match_entries = function(seed, first_entry) {
	var last_entry = seed_to_entry(this.last_entry_rank, prev_seed(seed));
	if (!ary_include(this.last_candidate_entries, last_entry)) return null;
	var n = 6;
	var seed_head = step_seed(seed, -n);
	// 乱数列が A,B,C,D,E,A,F のとき raw_entries は B,C,D,E,A,F になるので先頭要素が一致しなくなる
	// 先頭要素が一致しない場合はさらに前の乱数列をさかのぼってみる。
	for (;;seed_head=prev_seed(seed_head),n++) {
		var s = seed;
		var raw_entries = this.find_entries(seed_head, n);
		if (raw_entries === "break") break;
		if (raw_entries === "next") continue;
		if (raw_entries[0] !== first_entry) {
			// 先頭要素が一致しない
			continue;
		}
		var s = this.match_parent_ids(seed, raw_entries);
		if (s === null) continue;
		var swap1 = (s >>> 16) % 6;
		s= next_seed(s);
		var swap2 = (s >>> 16) % 6;
		if (!this.match_swap(raw_entries, swap1, swap2)) continue;
		return seed_head;
	}
	return null;
};

FindSeedProcedure.prototype.find_entries = function(seed, n) {
	var rank = this.rank;
	var bonus_rank = this.bonus_rank;
	var raw_entries = [];
	var steps = 0;
	var i = 0, num = 6 - this.num_bonus;
	while (i < 6) {
		var is_bonus = 6 - i <= this.num_bonus;
		var s = seed;
		var entry = seed_to_entry(is_bonus ? bonus_rank : rank, seed);
		seed = next_seed(seed);
		steps ++;
		if (steps > n) return "next";
		if (entries_collision0(entry, raw_entries)) continue;
		// アイテムも一致しないエントリが存在した場合
		if (!ary_include(this.items, entry.item)) {
			// ボーナスかどうかが逆の決定でアイテム重複でスキップされたエントリかもしれない
			var item = seed_to_entry(is_bonus ? rank : bonus_rank, s).item;
			if (this.num_bonus > 0 && ary_include(this.items, item)) {
				return "next";
			}
			// 同じ種族でスキップされたエントリかもしれない
			if (ary_include(this.pokemons, entry.pokemon)) {
				return "next";
			} else {
				return "break";
			}
		}
		raw_entries.push(entry);
		i ++;
	}
	if (steps !== n) return "next";
	for (var i = 0; i < 6; i ++) {
		if (!ary_include(this.entries, raw_entries[i])) {
			return "next";
		}
	}
	return raw_entries;
};

FindSeedProcedure.prototype.match_swap = function(raw_entries, swap1, swap2) {
	raw_entries = raw_entries.slice();
	ary_swap(raw_entries, 4, swap1);
	ary_swap(raw_entries, 5, swap2);
	return ary_eq(this.entries, raw_entries);
};

FindSeedProcedure.prototype.match_parent_ids = function(seed, raw_entries) {
	for (var i = 0; i < 6; i ++) {
		var entry = raw_entries[i];
		var expected_parent_id = this.parent_ids[indexof(this.entries, entry)];
		var parent_id = seed >>> 16;
		seed = next_seed(seed);
		if (expected_parent_id !== null && parent_id !== expected_parent_id) return null;
		var secret_id = seed >>> 16;
		seed = next_seed(seed);
		var nature = entry.nature;
		do {
			var pid_low = seed >>> 16;
			seed = next_seed(seed);
			var pid_high = seed >>> 16;
			seed = next_seed(seed);
			var pid = (pid_high << 16 | pid_low) >>> 0;
		} while (pid % 25 !== nature || is_shiny_pid(parent_id, secret_id, pid));
	}
	return seed;
};

function is_shiny_pid(parent_id, secret_id, pid) {
	return ((parent_id ^ secret_id ^ (pid >>> 16) ^ (pid & 0xffff)) & ~7) === 0;
}

function find_factory_entry(rank, name) {
	var re = roma2reg(name);
	var start = rank_entries_start[rank];
	var end = rank_entries_end[rank];
	for (var i = start; i <= end; i ++) {
		if (re.test(factory_data[i].name)) {
			return factory_data[i];
		}
	}
	return null;
}

function find_pokemon_entry(name) {
	var re = roma2reg(name);
	var l = pokemon_data.length;
	for (var i = 0; i < l; i ++) {
		if (re.test(pokemon_data[i].name)) {
			return pokemon_data[i];
		}
	}
	return null;
}

function fix_rank(rank, is_open_level) {
	var fixed_rank = rank;
	if (is_open_level) {
		fixed_rank += 3;
	}
	if (is_open_level && rank >= 8) { // オープン8周目
		fixed_rank = RANK_OPEN_8;
	} else if (fixed_rank >= 8) {
		fixed_rank = is_open_level ? RANK_8_OPEN : RANK_8_LV50;
	}
	return fixed_rank;
}

function fix_rank_enemy(rank, is_open_level) {
	if (is_open_level && rank <= 7) {
		var fixed_rank = rank + 3;
		if (fixed_rank >= 8) {
			fixed_rank = RANK_8_ENEMY;
		}
		return fixed_rank;
	} else {
		return rank;
	}
}

function limit_rank(rank) {
	return rank > 8 ? 8 : rank;
}

function unfix_rank(rank, is_open_level) {
	if (is_open_level) {
		return rank - 3;
	} else {
		return rank;
	}
}

// setTimeoutで待っているときに別な操作をされないように
Lock = {
	timer_id: null,
	setTimeout: function(fn, msec) {
		Lock.timer_id = setTimeout(function() {
			Lock.timer_id = null;
			fn();
		}, msec);
	},
	is_locked: function() {
		return Lock.timer_id !== null;
	},
	cancel: function() {
		if (Lock.timer_id !== null) {
			clearTimeout(Lock.timer_id);
			Lock.timer_id = null;
		}
	}
};

function roma2reg(text) {
	var result = [];
	var len = 0;
	for (var i = 0; i < text.length; i += len) {
		len = 1;
		var t = text.charAt(i)
		if (!/[a-z-]/.test(t)) {
			result.push(regexp_escape(t));
			continue;
		}
		var token = roma2reg_search_token(text, i);
		if (!token) {
			result.push(t);
			continue;
		}
		var kana = roma2reg.kana_map[token];
		if (token.length === 2 && kana === "ッ") {
			result.push("(?:" + token.charAt(0) + "|" + kana + ")");
		} else {
			result.push("(?:" + token + "|" + kana + ")");
			len = token.length;
		}
	}
	return new RegExp("^"+result.join("")+"$", "i");
}

function regexp_escape(s) {
	return s.replace(/\W/g,"\\$&");
}

function roma2reg_search_token(text, i) {
	for (var n = 4; n >= 1; n --) {
		var token = text.substr(i, n);
		if (roma2reg.kana_map.hasOwnProperty(token)) {
			return token;
		}
	}
	return null;
}

roma2reg.kana_map = {"a":"ア","i":"イ","yi":"イ","u":"ウ","wu":"ウ","whu":"ウ","e":"エ","o":"オ","la":"ァ","xa":"ァ","li":"ィ","xi":"ィ","lyi":"ィ","xyi":"ィ","lu":"ゥ","xu":"ゥ","le":"ェ","xe":"ェ","lye":"ェ","xye":"ェ","lo":"ォ","xo":"ォ","wha":"ウァ","whi":"ウィ","wi":"ウィ","whe":"ウェ","we":"ウェ","who":"ウォ","ka":"カ","ca":"カ","ki":"キ","ku":"ク","cu":"ク","qu":"ク","ke":"ケ","ko":"コ","co":"コ","lka":"ヵ","xka":"ヵ","lke":"ヶ","xke":"ヶ","ga":"ガ","gi":"ギ","gu":"グ","ge":"ゲ","go":"ゴ","kya":"キャ","kyi":"キィ","kyu":"キュ","kye":"キェ","kyo":"キョ","qya":"クャ","qyu":"クュ","qwa":"クァ","qa":"クァ","kwa":"クァ","qwi":"クィ","qi":"クィ","qyi":"クィ","qwu":"クゥ","qwe":"クェ","qe":"クェ","qye":"クェ","qwo":"クォ","qo":"クォ","gya":"ギャ","gyi":"ギィ","gyu":"ギュ","gye":"ギェ","gyo":"ギョ","gwa":"グァ","gwi":"グィ","gwu":"グゥ","gwe":"グェ","gwo":"グォ","sa":"サ","si":"シ","ci":"シ","shi":"シ","su":"ス","se":"セ","ce":"セ","so":"ソ","za":"ザ","zi":"ジ","ji":"ジ","zu":"ズ","ze":"ゼ","zo":"ゾ","sya":"シャ","sha":"シャ","syi":"シィ","syu":"シュ","shu":"シュ","sye":"シェ","she":"シェ","syo":"ショ","sho":"ショ","swa":"スァ","swi":"スィ","swu":"スゥ","swe":"スェ","swo":"スォ","zya":"ジャ","ja":"ジャ","jya":"ジャ","zyi":"ジィ","jyi":"ジィ","zyu":"ジュ","ju":"ジュ","jyu":"ジュ","zye":"ジェ","je":"ジェ","jye":"ジェ","zyo":"ジョ","jo":"ジョ","jyo":"ジョ","ta":"タ","ti":"チ","chi":"チ","tu":"ツ","tsu":"ツ","te":"テ","to":"ト","ltu":"ッ","xtu":"ッ","ltsu":"ッ","da":"ダ","di":"ヂ","du":"ヅ","de":"デ","do":"ド","tya":"チャ","cha":"チャ","cya":"チャ","tyi":"チィ","cyi":"チィ","tyu":"チュ","chu":"チュ","cyu":"チュ","tye":"チェ","che":"チェ","cye":"チェ","tyo":"チョ","cho":"チョ","cyo":"チョ","tsa":"ツァ","tsi":"ツィ","tse":"ツェ","tso":"ツォ","tha":"テャ","thi":"ティ","thu":"テュ","the":"テェ","tho":"テョ","twa":"トァ","twi":"トィ","twu":"トゥ","twe":"トェ","two":"トォ","dya":"ヂャ","dyi":"ヂィ","dyu":"ヂュ","dye":"ヂェ","dyo":"ヂョ","dha":"デャ","dhi":"ディ","dhu":"デュ","dhe":"デェ","dho":"デョ","dwa":"ドァ","dwi":"ドィ","dwu":"ドゥ","dwe":"ドェ","dwo":"ドォ","na":"ナ","ni":"ニ","nu":"ヌ","ne":"ネ","no":"ノ","nya":"ニャ|ンヤ","nyi":"ニィ","nyu":"ニュ|ンユ","nye":"ニェ","nyo":"ニョ|ンヨ","ha":"ハ","hi":"ヒ","hu":"フ","fu":"フ","he":"ヘ","ho":"ホ","ba":"バ","bi":"ビ","bu":"ブ","be":"ベ","bo":"ボ","pa":"パ","pi":"ピ","pu":"プ","pe":"ペ","po":"ポ","hya":"ヒャ","hyi":"ヒィ","hyu":"ヒュ","hye":"ヒェ","hyo":"ヒョ","fya":"フャ","fyu":"フュ","fyo":"フョ","fwa":"ファ","fa":"ファ","fwi":"フィ","fi":"フィ","fyi":"フィ","fwu":"フゥ","fwe":"フェ","fe":"フェ","fye":"フェ","fwo":"フォ","fo":"フォ","bya":"ビャ","byi":"ビィ","byu":"ビュ","bye":"ビェ","byo":"ビョ","va":"ヴァ","vi":"ヴィ","vu":"ヴ","ve":"ヴェ","vo":"ヴォ","vya":"ヴャ","vyi":"ヴィ","vyu":"ヴュ","vye":"ヴェ","vyo":"ヴョ","pya":"ピャ","pyi":"ピィ","pyu":"ピュ","pye":"ピェ","pyo":"ピョ","ma":"マ","mi":"ミ","mu":"ム","me":"メ","mo":"モ","mya":"ミャ","myi":"ミィ","myu":"ミュ","mye":"ミェ","myo":"ミョ","ya":"ヤ","yu":"ユ","yo":"ヨ","lya":"ャ","xya":"ャ","lyu":"ュ","xyu":"ュ","lyo":"ョ","xyo":"ョ","ra":"ラ","ri":"リ","ru":"ル","re":"レ","ro":"ロ","rya":"リャ","ryi":"リィ","ryu":"リュ","rye":"リェ","ryo":"リョ","wa":"ワ","wo":"ヲ","n":"ン","nn":"ン","n'":"ン","xn":"ン","lwa":"ヮ","xwa":"ヮ","bb":"ッ","cc":"ッ","dd":"ッ","ff":"ッ","gg":"ッ","hh":"ッ","jj":"ッ","kk":"ッ","ll":"ッ","mm":"ッ","pp":"ッ","qq":"ッ","rr":"ッ","ss":"ッ","tt":"ッ","vv":"ッ","ww":"ッ","xx":"ッ","yy":"ッ","zz":"ッ","-":"ー"};

function regularize_word(word) {
	// ひらがな → カタカナ
	// 半角カナ → カタカナ
	// 全角英数字 → 半角英数字
	var map = regularize_word.map;
	var chr = String.fromCharCode;
	return word.replace(/(?:[｡-ﾝ][ﾞﾟ]?|[ぁ-ゔ　！-～])/g, function(s) {
		var s1 = s.charAt(0);
		if ("｡" <= s1 && s1 <= "ﾝ" && s.length === 2) {
			if (s.charAt(1) === "ﾞ" && (("ｶ" <= s1 && s1 <= "ﾄ") || ("ﾊ" <= s1 && s1 <= "ﾎ"))) {
				return chr(map[s1].charCodeAt(0) + 1);
			} else if (s.charAt(1) === "ﾟ" && "ﾊ" <= s1 && s1 <= "ﾎ") {
				return chr(map[s1].charCodeAt(0) + 2);
			} else {
				return map[s1] + s.charAt(1);
			}
		}
		if ("ぁ" <= s && s <= "ゔ") {
			return chr(s.charCodeAt(0) - "ぁ".charCodeAt(0) + "ァ".charCodeAt(0));
		}
		if ("Ａ" <= s && s <= "Ｚ") {
			return chr(s.charCodeAt(0) - "Ａ".charCodeAt(0) + "A".charCodeAt(0));
		}
		if ("ａ" <= s && s <= "ｚ") {
			return chr(s.charCodeAt(0) - "ａ".charCodeAt(0) + "a".charCodeAt(0));
		}
		if ("！" <= s && s <= "～") {
			return chr(s.charCodeAt(0) - "！".charCodeAt(0) + "!".charCodeAt(0));
		}
		if (map.hasOwnProperty(s)) {
			return map[s];
		}
		return s;
	});
}

regularize_word.map = {"　": " ", "｡": "。", "｢": "「", "｣": "」", "､": "、", "･": "・", "ｦ": "ヲ", "ｧ": "ァ", "ｨ": "ィ", "ｩ": "ゥ", "ｪ": "ェ", "ｫ": "ォ", "ｬ": "ャ", "ｭ": "ュ", "ｮ": "ョ", "ｯ": "ッ", "ｰ": "ー", "ｱ": "ア", "ｲ": "イ", "ｳ": "ウ", "ｴ": "エ", "ｵ": "オ", "ｶ": "カ", "ｷ": "キ", "ｸ": "ク", "ｹ": "ケ", "ｺ": "コ", "ｻ": "サ", "ｼ": "シ", "ｽ": "ス", "ｾ": "セ", "ｿ": "ソ", "ﾀ": "タ", "ﾁ": "チ", "ﾂ": "ツ", "ﾃ": "テ", "ﾄ": "ト", "ﾅ": "ナ", "ﾆ": "ニ", "ﾇ": "ヌ", "ﾈ": "ネ", "ﾉ": "ノ", "ﾊ": "ハ", "ﾋ": "ヒ", "ﾌ": "フ", "ﾍ": "ヘ", "ﾎ": "ホ", "ﾏ": "マ", "ﾐ": "ミ", "ﾑ": "ム", "ﾒ": "メ", "ﾓ": "モ", "ﾔ": "ヤ", "ﾕ": "ユ", "ﾖ": "ヨ", "ﾗ": "ラ", "ﾘ": "リ", "ﾙ": "ル", "ﾚ": "レ", "ﾛ": "ロ", "ﾜ": "ワ", "ﾝ": "ン"};

function elementWithIn(elem1, elem2) {
	// elem2 が elem1 と同一の要素か、elem1 の子孫要素のとき true を返す
	var elem = elem2;
	while (elem) {
		if (elem === elem1) return true;
		 elem = elem.parentNode;
	}
	return false;
}

function escapeHTML(value) {
	return value.replace(/[&<>"]/g, function(s) { return escapeHTML.map[s]; }); // "
}
escapeHTML.map = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"};

function get_parent_element(e, tagName) {
	tagName = tagName.toUpperCase();
	while (e && e.nodeType === 1) {
		if (e.tagName.toUpperCase() === tagName) return e;
		e = e.parentNode;
	}
	return null;
}

function hasClass(e, className) {
	var s = e.className;
	if (s === className) return true;
	if (!/\s/.test(s)) return false;
	var classes = s.split(/\s+/);
	for (var i = 0, l = classes.length; i < l; i ++) {
		if (classes[i] === className) {
			return true;
		}
	}
	return false;
}

function addClass(e, className) {
	if (e.className === "") {
		e.className = className;
		return;
	}
	if (!hasClass(e, className)) {
		e.className += " " + className;
	}
}

function removeClass(e, className) {
	var s = e.className;
	if (s === className) {
		e.className = "";
		return;
	}
	if (!/\s/.test(s)) return;
	var classes = s.split(/\s+/);
	var index = -1;
	for (var i = 0, l = classes.length; i < l; i ++) {
		if (classes[i] === className) {
			index = i;
			break;
		}
	}
	if (index >= 0) {
		classes.splice(index, 1);
		e.className = classes.join(" ");
	}
}

function ary_include(ary, e) {
	return indexof(ary, e) >= 0;
}

function indexof(ary, e) {
	for (var i = 0; i < ary.length; i ++) {
		if (ary[i] === e) {
			return i;
		}
	}
	return -1;
}

function ary_eq(a, b) {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	var l = a.length;
	for (var i = 0; i < l; i ++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function ary_swap(array, i, j) {
	var tmp = array[i];
	array[i] = array[j];
	array[j] = tmp;
}

function map(array, fn) {
	var len = array.length;
	if (typeof fn === "string") fn = propname_callback(fn);
	var result = new Array(len);
	for (var i = 0; i < len; i ++) {
		result[i] = fn(array[i]);
	}
	return result;
}

function propname_callback(name) {
	return function(e) {
		return e[name];
	};
}

function format_hex(n, prec) {
	var s = n.toString(16);
	return "0x" + (str_repeat("0", prec - s.length) + s);
}

function format_dec(n, prec, c) {
	var s = String(n);
	return (str_repeat(c || "0", prec - s.length) + s);
}

function str_repeat(s, n) {
	var r = "";
	for (var i = 0; i < n; i ++) {
		r += s;
	}
	return r;
}

function rjust_name(name) {
	var width = name.length * 2;
	if (/[2Z]$/.test(name)) width -= 1; // ポリゴン[2Z]
	return str_repeat(" ", 10 - width) + name;
}

function UNREACHABLE() {
	throw new Error("unreachable");
}

function step_seed(seed, n) {
	var fn = next_seed;
	if (n < 0) {
		fn = prev_seed;
		n = -n;
	}
	for (var i = 0; i < n; i ++) {
		seed = fn(seed);
	}
	return seed >>> 0;
}

function next_seed(seed) {
	return mul(seed, 0x41c64e6d) + 0x6073 >>> 0;
}

function prev_seed(seed) {
	return mul(seed, 0xeeb9eb65) + 0xa3561a1 >>> 0;
}

function mul(a, b) {
	var a1 = a >>> 16, a2 = a & 0xffff;
	var b1 = b >>> 16, b2 = b & 0xffff;
	return (((a1 * b2 + a2 * b1) << 16) + a2 * b2) >>> 0;
}
