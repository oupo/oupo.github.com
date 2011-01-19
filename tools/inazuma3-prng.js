function PRNG(high, low) {
	this.seed = new MutableUint64(high, low);
	this.advancement = 0;
}

PRNG.A_HIGH = 0x5d588b65, PRNG.A_LOW = 0x6c078965;
PRNG.B_HIGH = 0x00000000, PRNG.B_LOW = 0x00269ec3;

PRNG.CONST_REVERSE = {
	A_HIGH: 0xdedcedae, A_LOW: 0x9638806d,
	B_HIGH: 0x9b1ae6e9, B_LOW: 0xa384e6f9
};

PRNG.CONST_ffffffff00000000 = {
	A_HIGH: 0x8f2f99a4, A_LOW: 0x00000001, 
	B_HIGH: 0xae4f7273, B_LOW: 0x00000000
};

PRNG.prototype.set_seed = function(high, low) {
	this.seed.high = high;
	this.seed.low = low;
	this.advancement = 0;
}

PRNG.prototype.rand = function(max) {
	this.seed.mul(PRNG.A_HIGH, PRNG.A_LOW);
	this.seed.add(PRNG.B_HIGH, PRNG.B_LOW);
	this.advancement ++;
	
	return PRNG.gen_rand(this.seed.high, max);
};

PRNG.prototype.step = function(num) {
	PRNG.step_seed(this.seed, num);
	this.advancement += num;
};

PRNG.step_seed = function(seed, num) {
	var a = new MutableUint64(PRNG.A_HIGH, PRNG.A_LOW);
	var b = new MutableUint64(PRNG.B_HIGH, PRNG.B_LOW);
	var n = num >>> 0;
	if (num < 0) {
		var c = PRNG.CONST_ffffffff00000000;
		seed.mul(c.A_HIGH, c.A_LOW);
		seed.add(c.B_HIGH, c.B_LOW);
	}
	while (true) {
		if (n & 1) {
			seed.mul(a.high, a.low);
			seed.add(b.high, b.low);
		}
		n >>>= 1;
		if (n === 0) break;
		
		var b_high = b.high, b_low = b.low;
		b.mul(a.high, a.low);
		b.add(b_high, b_low);
		
		a.mul(a.high, a.low);
	}
};

PRNG.prototype.reverse_rand = function(max) {
	var ret = PRNG.gen_rand(this.seed.high, max);
	
	var c = PRNG.CONST_REVERSE;
	this.seed.mul(c.A_HIGH, c.A_LOW);
	this.seed.add(c.B_HIGH, c.B_LOW);
	this.advancement --;
	
	return ret;
};

PRNG.prototype.clone = function() {
	return new PRNG(this.seed.high, this.seed.low);
}

PRNG.gen_rand = function(high, max) {
	// JSのnumberは2^53までの整数しか正確に表現できないけど、誤差が0x100000000を超えることはないはず？
	return u32(high * max / 0x100000000);
};

/*
乱数1つ進めて、そのseedで何かいろいろ調べてー、また乱数1つ進めてーってことを普通にやると
PRNGオブジェクト生成が大量に行われたり、同じseedについての次のseedを求める計算が何回も行われるので無駄

そのためにPRNGと同じインターフェースを返すオブジェクトを使いまわしたり、seed値をキャッシュするためのもの

Stream#nextを使うとそれまでにnextが返してきたオブジェクトは使えなくなる
*/

var PRNGStream = (function() {

function PRNGStream(high, low, advancement, next_size, prev_size) {
	this.seed = new MutableUint64(high, low);
	
	this.next_size = next_size;
	this.prev_size = prev_size;
	this.buffer_size = next_size + prev_size + 1;
	
	this.buffer = gen_buffer([], this.seed, advancement, next_size, prev_size);
	this.buffer_index = 0;
	this.prng_fake = new PRNGFake(this.buffer, next_size, prev_size);
}

PRNGStream.prototype.next = function() {
	this.buffer[this.buffer_index * 2] = this.seed.low;
	this.buffer[this.buffer_index * 2 + 1] = this.seed.high;
	this.buffer_index = (this.buffer_index + 1) % this.buffer_size;
	next_seed(this.seed);
	this.prng_fake.reset((this.buffer_index + this.prev_size) % this.buffer_size);
	return this.prng_fake;
};

PRNGStream.prototype.reset = function(high, low, advancement) {
	this.seed.high = high, this.seed.low = low;
	gen_buffer(this.buffer, this.seed, advancement, this.next_size, this.prev_size);
	this.buffer_index = 0;
	this.prng_fake.reset((this.buffer_index + this.prev_size) % this.buffer_size);
};

function gen_buffer(buffer, seed, advancement, next_size, prev_size) {
	// 1回目のnextで初期状態にするため初期状態の1つ前にする
	PRNG.step_seed(seed, advancement - prev_size - 1);
	var size = next_size + prev_size + 1;
	for (var i = 0; i < size; i ++) {
		buffer[i*2] = seed.low;
		buffer[i*2+1] = seed.high;
		next_seed(seed);
	}
	return buffer;
}

function PRNGFake(buffer, next_size, prev_size) {
	this.buffer = buffer;
	this.next_size = next_size;
	this.prev_size = prev_size;
	this.buffer_size = next_size + prev_size + 1;
	this.buffer_index = 0;
	this.advancement = 0;
	this.real_prng = null;
}

PRNGFake.prototype.reset = function(buffer_index) {
	this.buffer_index = buffer_index;
	this.advancement = 0;
	this.real_prng = null;
};

PRNGFake.prototype.rand = function(max) {
	this.advancement ++;
	if (this.real_prng) {
		return this.real_prng.rand(max);
	}
	if (this.advancement > this.next_size) {
		return this.gen_real_prng(this.advancement - 1).rand(max);
	}
	var index = mod(this.buffer_index + this.advancement, this.buffer_size);
	var high = this.buffer[index * 2 + 1];
	return PRNG.gen_rand(high, max);
};

PRNGFake.prototype.reverse_rand = function(max) {
	this.advancement --;
	if (this.real_prng) {
		return this.real_prng.reverse_rand(max);
	}
	if (this.advancement < -this.prev_size) {
		return this.gen_real_prng(this.advancement + 1).reverse_rand(max);
	}
	var index = mod(this.buffer_index + this.advancement + 1, this.buffer_size);
	var high = this.buffer[index * 2 + 1];
	return PRNG.gen_rand(high, max);
	
};

PRNGFake.prototype.step = function(num) {
	var prev_advancement = this.advancement;
	this.advancement += num;
	if (this.real_prng) {
		this.real_prng.step(num);
		return;
	}
	if (!(-this.prev_size <= this.advancement && this.advancement <= this.next_size)) {
		this.gen_real_prng(prev_advancement).step(num);
		return;
	}
};

PRNGFake.prototype.rewind = function() {
		this.step(-this.advancement);
};

PRNGFake.prototype.get_seed = function() {
	var index = mod(this.buffer_index + this.advancement, this.buffer_size);
	var low = this.buffer[index * 2];
	var high = this.buffer[index * 2 + 1];
	return new MutableUint64(high, low);
}

PRNGFake.prototype.gen_real_prng = function(advancement) {
	var index = mod(this.buffer_index + advancement, this.buffer_size);
	var low = this.buffer[index * 2];
	var high = this.buffer[index * 2 + 1];
	this.real_prng = new PRNG(high, low);
	return this.real_prng;
};

PRNGFake.prototype.get_seed_low = function() {
	var index = mod(this.buffer_index + this.advancement, this.buffer_size);
	return this.buffer[index * 2];
};

PRNGFake.prototype.get_seed_high = function() {
	var index = mod(this.buffer_index + this.advancement, this.buffer_size);
	return this.buffer[index * 2 + 1];
};

function next_seed(seed) {
	seed.mul(PRNG.A_HIGH, PRNG.A_LOW);
	seed.add(PRNG.B_HIGH, PRNG.B_LOW);
}

function mod(a, b) {
	return (a % b) + (a < 0 ? b : 0);
}


return PRNGStream;
})();

function MutableUint64(high, low) {
	this.high = high;
	this.low = low;
}

MutableUint64.prototype.set = function(high, low) {
	this.high = high;
	this.low = low;
};

MutableUint64.prototype.add = function(o_high, o_low) {
	var low = this.low + o_low;
	var carry = low > 0xffffffff;
	this.low = u32(low);
	this.high = u32(this.high + o_high + (carry ? 1 : 0));
	return this;
};

MutableUint64.prototype.add_shift = function(other, shift) {
	var low, high;
	if (shift < 32) {
		low = u32(other << shift);
		high = shift == 0 ? 0 : other >>> (32 - shift);
	} else {
		low = 0;
		high = u32(other << (shift - 32));
	}
	this.add(high, low);
};

MutableUint64.prototype.mul = function(o_high, o_low) {
	var a = this.high >>> 16, b = this.high & 0xffff, c = this.low >>> 16, d = this.low & 0xffff;
	var e =    o_high >>> 16, f =    o_high & 0xffff, g =    o_low >>> 16, h =    o_low & 0xffff;
	
	this.high = this.low = 0;
	
	this.add_shift(h * d,  0);
	this.add_shift(h * c, 16);
	this.add_shift(h * b, 32);
	this.add_shift(h * a, 48);
	
	this.add_shift(g * d, 16);
	this.add_shift(g * c, 32);
	this.add_shift(g * b, 48);
	
	this.add_shift(f * d, 32);
	this.add_shift(f * c, 48);
	
	this.add_shift(e * d, 48);
	return this;
};

MutableUint64.prototype.toString = function() {
	return (0x100000000 + this.high).toString(16).slice(1) + (0x100000000 + this.low).toString(16).slice(1);
}

function u32(x) {
	return x >>> 0;
}
