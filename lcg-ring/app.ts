var NATURE = ["がんばりや", "さみしがり", "ゆうかん", "いじっぱり", "やんちゃ", "ずぶとい", "すなお", "のんき", "わんぱく", "のうてんき", "おくびょう", "せっかち", "まじめ", "ようき", "むじゃき", "ひかえめ", "おっとり", "れいせい", "てれや", "うっかりや", "おだやか", "おとなしい", "なまいき", "しんちょう", "きまぐれ"];

interface Const {
    a: number;
    b: number;
}

function u32(x: number): number {
    return x >>> 0;
}

function mul(a: number, b: number): number {
    var a1 = a >>> 16, a2 = a & 0xffff;
    var b1 = b >>> 16, b2 = b & 0xffff;
    return u32(((a1 * b2 + a2 * b1) << 16) + a2 * b2);
}

function hex(x: number, n = 8) {
    var s = x.toString(16);
    while (s.length < n) s = "0" + s;
    return s;
}

function seed_make_const(n: number): Const {
    var A = 0x41c64e6d, B = 0x6073;
    var a = A, b = B;
    var c = 1, d = 0;
    while (n) {
        if (n & 1) {
            d = u32(mul(d, a) + b);
            c = mul(c, a);
        }
        b = u32(mul(b, a) + b);
        a = mul(a, a);
        n >>>= 1;
    }
    return { a: c, b: d };
}

var seed_step_minus_2_pow_n = (() => {
    var consts: Array<Const>;

    function initialize() {
        if (consts) return;
        consts = [];
        for (var i = 0; i < 32; i++) {
            consts[i] = seed_make_const(-(1 << i));
        }
    }

	return function (seed: number, n: number): number {
        initialize();
        return u32(mul(seed, consts[n].a) + consts[n].b);
    }
})();

function seed_stepper(n: number): (seed: number) => number {
    var c = seed_make_const(n);
    return function (seed: number): number {
        return u32(mul(seed, c.a) + c.b);
    };
}

function seed_step(seed: number, n: number): number {
    return seed_stepper(n)(seed);
}

var seed_next = seed_stepper(1);
var seed_prev = seed_stepper(-1);
var seed_prev_prev = seed_stepper(-2);

function seed_to_index0(seed: number, i: number): number {
    if (i === 32) {
        return 0;
    } else if ((seed >>> i) & 1) {
        return seed_to_index0(seed_step_minus_2_pow_n(seed, i), i + 1) * 2 + 1;
    } else {
        return seed_to_index0(seed, i + 1) * 2;
    }
}

function seed_to_index(seed: number): number {
    return seed_to_index0(seed, 0);
}

function search_seed(iv: Array<number>): Array<number> {
    var bah = iv[2] * (32 * 32) + iv[1] * 32 + iv[0];
    var dcs = iv[4] * (32 * 32) + iv[3] * 32 + iv[5];
    var found = Array<number>();
    for (var i = 0; i < 65536 * 2; i++) {
        var seed = (i >> 1) + bah * 65536 + ((i & 1) << 31);
        if (((seed_next(seed) >> 16) & ((1 << 15) - 1)) == dcs) {
            found.push(u32(seed));
        }
    }
    return found;
}

function draw(canvas: HTMLCanvasElement, seeds: Array<number>, indexes: Array<number>) {
    var ctx = canvas.getContext("2d");
    var sz = 500;
    canvas.width = sz * 1.3;
    canvas.height = sz * 1.2;
    ctx.translate(0, 30);
    ctx.lineWidth = 0.05 * sz;
    ctx.fillStyle = "#2D89E5";
    ctx.beginPath();
    ctx.arc(sz / 2, sz / 2, 0.45 * sz, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(sz / 2, sz / 2, 0.4 * sz, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "black";


    ctx.fillStyle = "gray";
    drawPointer(0, 0.03);
    drawText(ctx, "0", sz / 2, 0);

    seeds.forEach((seed, i) => {
        var index = indexes[i];
        var rad = 2 * Math.PI * (index / 0x100000000);
        ctx.fillStyle = "#F28100";
        drawPointer(rad);
        var x = 0.5 * sz + (0.5 - 0.02) * sz * Math.sin(rad);
        var y = 0.5 * sz + (0.5 - 0.02) * sz * -Math.cos(rad);
        var pid = u32(((seed_prev(seed) >>> 16) << 16) + (seed_prev_prev(seed) >>> 16));
        ctx.font = "12px sans-serif";
        drawText(ctx, "seed = " + hex(seed), x + 0.02 * sz, y);
        drawText(ctx, "pid = " + hex(pid) + " " + NATURE[pid % 25], x + 0.02 * sz, y + 12);

        //ctx.fillRect(x-10, y-10, 20, 20);
    });

    function drawPointer(rad, len = 0.05) {
        ctx.save();
        ctx.translate(sz / 2, sz / 2);
        ctx.rotate(rad);
        ctx.beginPath();
        ctx.moveTo(0, (-0.5 + 0.05) * sz);
        ctx.lineTo(- 0.01 * sz, (-0.5 + 0.05 - len) * sz);
        ctx.lineTo(+ 0.01 * sz, (-0.5 + 0.05 - len) * sz);
        ctx.fill();
        ctx.restore();
    }
}

function drawText(ctx, text, x, y) {
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(text, x - 1, y);
    ctx.fillText(text, x + 1, y);
    ctx.fillText(text, x, y - 1);
    ctx.fillText(text, x, y + 1);
    ctx.fillStyle = "black";
    ctx.fillText(text, x, y);
}


window.onload = () => {
    var el = document.getElementById("content");
    var canvas = document.createElement("canvas");
    el.appendChild(canvas);
    update();
    document.getElementById("iv").addEventListener("keypress", function (ev) {
        if (ev.keyCode == 13) {
            update();
        }
    });
    
    function update() {
        var iv = document.getElementById("iv").value.split("-").map(Number);
        var seeds = search_seed(iv);
        var indexes = seeds.map(seed_to_index);
        draw(canvas, seeds, indexes);
    }
};
