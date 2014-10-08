/// <reference path="jquery.d.ts" />

var NAMES = ["ハジメ", "ツギコ", "イチミ", "ミライ", "チユ", "パソキチ", "アートス", "アリョーナ", "アッツォ", "アントニナ", "アルヒッパ", "アリビーナ", "アントン", "アスタ", "アンセルミ", "アンネリ", "アルピ", "アネルマ", "アッラン", "アイニッキ", "アーポ", "アーム", "アクセル", "アッスンタ", "アッサール", "アラベッラ", "アティリオ", "アンネッタ", "アマンド", "アガタ", "ジャコブ", "ジャサント", "ジェローム", "ジョゼ", "ジュスタン", "ジャンヌ", "ジュール", "ジュリー", "ジャスパー", "ジェーン", "ジェヒュー", "ジャニス", "ジョナス", "ジェナ", "ジャレッド", "ジョアン", "ジャン", "ジョイス", "ジョエル", "ジョスリン", "ジョシュア", "ジェシー", "ジェリー", "ジュディス", "チェレン", "ホミカ", "アーティ", "カミツレ", "ヤーコン", "フウロ", "シャガ", "シズイ"];

interface Result {
    seed: number;
    gymleader_rand: number;
    gymleader: number;
    visitors: Array<number>;
}

function listVisitors(seed: number, visitorsNum: number, outNum): Array<Result> {
    var res: Array<Result> = [];
    var s = seed;
    for (var i = 0; i < outNum; i++) {
        var lcg = new LCG(0, s);
        for (var j = 0; j < 21; j++) lcg.next();
        var gymleader_rand = lcg.rand(100);
        var gymleader = 54 + lcg.clone().rand(8);
        var visitors: Array<number> = [];
        for (var j = 0; j < visitorsNum; j++) {
            visitors.push(lcg.rand(48) + 6);
        }
        res.push({
            seed: s,
            gymleader_rand: gymleader_rand,
            gymleader: gymleader,
            visitors: visitors
        });
        s = nextDailySeed(s);
    }
    return res;
}

function hex(s: number): string {
    return (0x100000000 + s).toString(16).slice(1);
}

function onSubmit() {
    var form: HTMLFormElement = document.forms["f"];
    var seed = Number(form.elements["seed"].value);
    var visitorsNum = Number(form.elements["visitorsNum"].value);
    var outNum = Number(form.elements["outNum"].value);
    var results = listVisitors(seed, visitorsNum, outNum);
    var trs = results.map((r, i) => {
        var $tr = $("<tr>");
        $tr.append($("<th>").text(i));
        $tr.append($("<td>").text(hex(r.seed)));
        $tr.append($("<td>").text(r.gymleader_rand));
        $tr.append($("<td>").text(NAMES[r.gymleader]));
        r.visitors.forEach(function (visitor) {
            $tr.append($("<td>").text(NAMES[visitor]));
        });
        return $tr;
    });
    var $tr = $("<tr><th>i<th>seed<th>ジムリーダー判定<th>ジムリーダー<th colspan="+visitorsNum+"><center>ファン</tr>");
    trs.unshift($tr);
    $("#out").empty().append($("<table>").append(trs));
}

window.onload = () => {
    var form: HTMLFormElement = document.forms["f"];
    form.addEventListener("submit", onSubmit);
}

//console.log(listVisitors(1, 10, 10));