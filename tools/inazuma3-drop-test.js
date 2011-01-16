
function set_drop_search_form_values(values) {
	var form = document.forms.drop_search;
	var units_input_area = get_units_input_area(form);

	for (var i = 0; i < 3; i ++) {
		form.elements["check"+i].checked = values.items[i][0];
		form.elements["item"+i].value = values.items[i][1];
		form.elements["odd"+i].value = values.items[i][2];
	}
	form.elements.exp_base.value = values.exp_base;
	
	for (var team = 0; team < 2; team ++) {
		for (var i = 0; i < 16; i ++) {
			var input = get_unit_name_input(units_input_area, TEAM_NAMES[team], i);
			input.value = values.unit_names[team][i];
			update_unit_input_color(input);
		}
	}

	fire_change_unit_names(units_input_area, "player");
	fire_change_unit_names(units_input_area, "enemy");

	form.elements.fseed.value = values.fseed;
	form.elements.advancement_min.value = values.advancement_min;
	form.elements.advancement_max.value = values.advancement_max;
	form.elements.check_hastalkfile_advancement.checked = values.check_hastalkfile_advancement;
	form.elements.check_count_before_advancement.checked = values.check_count_before_advancement;
}

function take_result_drop_search() {
	var tbody = document.getElementById("drop-search-result").getElementsByTagName("tbody")[0];
	var result = [];
	var tr_list = tbody.childNodes;
	for (var i = 1; i < tr_list.length; i ++) {
		var tr = tr_list[i];
		result.push(array_map(tr.childNodes, function(td) {
			var s = td.textContent;
			return s !== undefined ? s : td.innerText;
		}).join(","));
	}
	return result;
}


function test_drop() {
	set_drop_search_form_values({
		items: [[false, "x", 50], [false, "y", 40], [false, "z", 30]],
		exp_base: "500,1000,100",
		unit_names: ["y,,y,,y,,y,,y,,y,,y,,y,".split(","), "y,y,y,y,y,y,y,y,,,,,,,,".split(",")],
		fseed: 0x10c,
		advancement_min: 0,
		advancement_max: 20,
		check_hastalkfile_advancement: true,
		check_count_before_advancement: true
	});
	on_submit_drop_search(document.forms.drop_search);


	var expected = [
		"0,08,11,-,-,-,457,909,103",
		"1,11,11,-,-,-,457,909,103",
		"2,11,10,-,-,z,520,1030,91",
		"3,10,08,-,y,-,505,917,94",
		"4,01,08,-,y,-,505,917,94",
		"5,08,06,-,y,z,454,1005,98",
		"6,07,06,-,y,z,454,1005,98",
		"7,06,08,x,-,-,458,1013,101",
		"8,01,08,x,-,-,458,1013,101",
		"9,08,03,x,-,-,502,1024,97",
		"10,01,03,x,-,-,502,1024,97",
		"11,03,06,-,-,-,494,976,109",
		"12,06,07,-,y,-,509,941,103",
		"13,05,07,-,y,-,509,941,103",
		"14,07,07,x,-,z,512,1030,90",
		"15,07,07,-,y,-,488,907,98",
		"16,07,05,x,-,z,548,989,103",
		"17,05,11,x,-,-,515,951,94",
		"18,11,03,x,-,-,515,951,94",
		"19,03,08,x,-,z,453,947,98",
		"20,08,05,x,y,-,515,949,106"
	];

	var got = take_result_drop_search();

	console.log("drop test: "+(array_eq(got, expected) ? "pass" : "fail"));
}

function benchmark_drop() {
	set_drop_search_form_values({
		items: [[true, "x", 5], [true, "y", 5], [false, "z", 30]],
		exp_base: "500,1000,100",
		unit_names: ["y,,y,,y,,y,,y,,y,,y,,y,".split(","), "y,y,y,y,y,y,y,y,,,,,,,,".split(",")],
		fseed: 0x10c,
		advancement_min: 0,
		advancement_max: 2000,
		check_hastalkfile_advancement: true,
		check_count_before_advancement: true
	});
	
	var start_time = new Date().getTime();
	on_submit_drop_search(document.forms.drop_search);
	var end_time = new Date().getTime();
	
	console.log("drop benchmark: "+(end_time - start_time)+" ms");
}

test_drop();
benchmark_drop();

