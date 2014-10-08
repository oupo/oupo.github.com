function u32(x) {
    return x >>> 0;
}

function nextDailySeed(s) {
    var x = new MutableUint64(0, s);
    x.mul(0x5d583d6d, 0x6c078979);
    x.add(0, 0x26a693);
    return x.high;
}

var LCG = (function () {
    function LCG(high, low) {
        this.seed = new MutableUint64(high, low);
    }
    LCG.createFromUint64 = function (x) {
        return new LCG(x.high, x.low);
    };

    LCG.prototype.clone = function () {
        return LCG.createFromUint64(this.seed);
    };

    LCG.prototype.next = function () {
        this.seed.mul(LCG.A_HIGH, LCG.A_LOW);
        this.seed.add(LCG.B_HIGH, LCG.B_LOW);
    };

    LCG.prototype.rand = function (max) {
        this.next();
        return this.rand0(max);
    };

    LCG.prototype.rand0 = function (max) {
        return LCG.get_rand(this.seed.high, max);
    };

    LCG.get_rand = function (high, max) {
        // u32((x * y) / 2^32) を計算するのだが x * y の計算で誤差がでうる
        // y が 2^(53-32) 以下の場合 x * y は 2 ^ 53 以下となり誤差はでない
        var x = high, y = max;
        var _2_pow_32 = 0x100000000;
        var product = x * y;
        if (y <= (1 << (53 - 32)) || product % _2_pow_32 !== 0) {
            return u32(product / _2_pow_32);
        } else {
            return new MutableUint64(0, x).mul(0, y).high;
        }
    };
    LCG.A_HIGH = 0x5d588b65;
    LCG.A_LOW = 0x6c078965;
    LCG.B_HIGH = 0;
    LCG.B_LOW = 0x269ec3;
    return LCG;
})();

var MutableUint64 = (function () {
    function MutableUint64(high, low) {
        this.high = high;
        this.low = low;
    }
    MutableUint64.prototype.set = function (high, low) {
        this.high = high;
        this.low = low;
    };

    MutableUint64.prototype.add = function (o_high, o_low) {
        var low = this.low + o_low;
        var carry = low > 0xffffffff;
        this.low = u32(low);
        this.high = u32(this.high + o_high + (carry ? 1 : 0));
        return this;
    };

    MutableUint64.prototype.mul = function (b_high, b_low) {
        var a = this;
        var a3 = a.high >>> 16, a2 = a.high & 0xffff, a1 = a.low >>> 16, a0 = a.low & 0xffff;
        var b3 = b_high >>> 16, b2 = b_high & 0xffff, b1 = b_low >>> 16, b0 = b_low & 0xffff;

        /*
        掛け算の筆算
        : a3 a2 a1 a0
        X : b3 b2 b1 b0
        -------------------------------------
        :a3b0 a2b0 a1b0 a0b0
        a3b1:a2b1 a1b1 a0b1
        a3b2 a2b2:a1b2 a0b2
        a3b3 a2b3 a1b3:a0b3
        ------------------------------------
        a * b
        = a0b0
        + ((a1b0 + a0b1) << 16)
        + ((a2b0 + a1b1 + a0b2) << 32)
        + ((a3b0 + a2b1 + a1b2 + a0b3) << 48)
        */
        this.high = u32((a2 * b0 + a1 * b1 + a0 * b2) + (a3 * b0 + a2 * b1 + a1 * b2 + a0 * b3) * 0x10000);
        this.low = u32(a0 * b0);

        // ((a1b0 + a0b1) << 16)の部分はhighとlowにまたがっていて繰り上がりの処理をしなければならない
        var x = a1 * b0;
        this.add(x >>> 16, u32(x << 16));
        var x = a0 * b1;
        this.add(x >>> 16, u32(x << 16));
        return this;
    };
    MutableUint64.prototype.toString = function () {
        return (0x100000000 + this.high).toString(16).slice(1) + (0x100000000 + this.low).toString(16).slice(1);
    };
    return MutableUint64;
})();
/*
window.onload = () => {
var lcg = new LCG(0, 0);
console.log(lcg.rand(10000));
console.log(lcg.rand(10000));
console.log(lcg.rand(10000));
console.log(lcg.rand(10000));
console.log(lcg.rand(10000));
};
*/
//# sourceMappingURL=seed.js.map
