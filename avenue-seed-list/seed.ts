function u32(x: number): number {
    return x >>> 0;
}

function nextDailySeed(s: number): number {
    var x = new MutableUint64(0, s);
    x.mul(0x5d583d6d, 0x6c078979);
    x.add(0, 0x26a693);
    return x.high;
}

class LCG {
    static A_HIGH = 0x5d588b65;
    static A_LOW = 0x6c078965;
    static B_HIGH = 0;
    static B_LOW = 0x269ec3;

    seed: MutableUint64;

    constructor(high: number, low: number) {
        this.seed = new MutableUint64(high, low);
    }

    static createFromUint64(x: MutableUint64): LCG {
        return new LCG(x.high, x.low);
    }

    clone(): LCG {
        return LCG.createFromUint64(this.seed);
    }

    next() {
        this.seed.mul(LCG.A_HIGH, LCG.A_LOW);
        this.seed.add(LCG.B_HIGH, LCG.B_LOW);
    }

    rand(max: number): number {
        this.next();
        return this.rand0(max);
    }

    rand0(max: number): number {
        return LCG.get_rand(this.seed.high, max);
    }

    static get_rand(high: number, max: number): number {
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
    }
}


class MutableUint64 {
    public high: number;
    public low: number;

    constructor(high: number, low: number) {
        this.high = high;
        this.low = low;
    }

    set(high: number, low: number) {
        this.high = high;
        this.low = low;
    }

    add(o_high: number, o_low: number): MutableUint64 {
        var low = this.low + o_low;
        var carry = low > 0xffffffff;
        this.low = u32(low);
        this.high = u32(this.high + o_high + (carry ? 1 : 0));
        return this;
    }

    mul(b_high: number, b_low: number): MutableUint64 {
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
    }
    toString(): string {
        return (0x100000000 + this.high).toString(16).slice(1) + (0x100000000 + this.low).toString(16).slice(1);
    }
}

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