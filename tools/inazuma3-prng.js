function PRNG(high, row) {
	this.seed = new MutableUint64(high, row);
	this.advancement = 0;
}

PRNG.A_HIGH = 0x5d588b65, PRNG.A_ROW = 0x6c078965;
PRNG.B_HIGH = 0x00000000, PRNG.B_ROW = 0x00269ec3;

PRNG.CONST_REVERSE = {
	A_HIGH: 0xdedcedae, A_ROW: 0x9638806d,
	B_HIGH: 0x9b1ae6e9, B_ROW: 0xa384e6f9
};

PRNG.CONST_ffffffff00000000 = {
	A_HIGH: 0x8f2f99a4, A_ROW: 0x00000001, 
	B_HIGH: 0xae4f7273, B_ROW: 0x00000000
};

PRNG.prototype.set_seed = function(high, row) {
	this.seed.high = high;
	this.seed.row = row;
	this.advancement = 0;
}

PRNG.prototype.rand = function(max) {
	this.seed.mul(PRNG.A_HIGH, PRNG.A_ROW);
	this.seed.add(PRNG.B_HIGH, PRNG.B_ROW);
	this.advancement ++;
	
	return PRNG.gen_rand(this.seed.high, max);
};

PRNG.prototype.step = function(num) {
	PRNG.step_seed(this.seed, num);
	this.advancement += num;
};

PRNG.step_seed = function(seed, num) {
	var a = new MutableUint64(PRNG.A_HIGH, PRNG.A_ROW);
	var b = new MutableUint64(PRNG.B_HIGH, PRNG.B_ROW);
	var n = num >>> 0;
	if (num < 0) {
		var c = PRNG.CONST_ffffffff00000000;
		seed.mul(c.A_HIGH, c.A_ROW);
		seed.add(c.B_HIGH, c.B_ROW);
	}
	while (true) {
		if (n & 1) {
			seed.mul(a.high, a.row);
			seed.add(b.high, b.row);
		}
		n >>>= 1;
		if (n === 0) break;
		
		var b_high = b.high, b_row = b.row;
		b.mul(a.high, a.row);
		b.add(b_high, b_row);
		
		a.mul(a.high, a.row);
	}
};

PRNG.prototype.reverse_rand = function(max) {
	var ret = PRNG.gen_rand(this.seed.high, max);
	
	var c = PRNG.CONST_REVERSE;
	this.seed.mul(c.A_HIGH, c.A_ROW);
	this.seed.add(c.B_HIGH, c.B_ROW);
	this.advancement --;
	
	return ret;
};

PRNG.prototype.clone = function() {
	return new PRNG(this.seed.high, this.seed.row);
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

function PRNGStream(high, row, advancement, next_size, prev_size) {
	this.seed = new MutableUint64(high, row);
	
	this.next_size = next_size;
	this.prev_size = prev_size;
	this.buffer_size = next_size + prev_size + 1;
	
	this.buffer = gen_buffer(this.seed, advancement, next_size, prev_size);
	this.buffer_index = 0;
	this.prng_fake = new PRNGFake(this.buffer, next_size, prev_size);
}

PRNGStream.prototype.next = function() {
	this.buffer[this.buffer_index * 2] = this.seed.row;
	this.buffer[this.buffer_index * 2 + 1] = this.seed.high;
	this.buffer_index = (this.buffer_index + 1) % this.buffer_size;
	next_seed(this.seed);
	this.prng_fake.reset((this.buffer_index + this.prev_size) % this.buffer_size);
	return this.prng_fake;
};

function gen_buffer(seed, advancement, next_size, prev_size) {
	var buffer = [];
	// 1回目のnextで初期状態にするため初期状態の1つ前にする
	PRNG.step_seed(seed, advancement - prev_size - 1);
	var size = next_size + prev_size + 1;
	for (var i = 0; i < size; i ++) {
		buffer[i*2] = seed.row;
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

PRNGFake.prototype.get_seed = function() {
	var index = mod(this.buffer_index + this.advancement, this.buffer_size);
	var row = this.buffer[index * 2];
	var high = this.buffer[index * 2 + 1];
	return new MutableUint64(high, row);
}

PRNGFake.prototype.gen_real_prng = function(advancement) {
	var index = mod(this.buffer_index + advancement, this.buffer_size);
	var row = this.buffer[index * 2];
	var high = this.buffer[index * 2 + 1];
	this.real_prng = new PRNG(high, row);
	return this.real_prng;
};

PRNGFake.prototype.get_seed_row = function() {
	var index = mod(this.buffer_index + this.advancement, this.buffer_size);
	return this.buffer[index * 2];
};

PRNGFake.prototype.get_seed_high = function() {
	var index = mod(this.buffer_index + this.advancement, this.buffer_size);
	return this.buffer[index * 2 + 1];
};

function next_seed(seed) {
	seed.mul(PRNG.A_HIGH, PRNG.A_ROW);
	seed.add(PRNG.B_HIGH, PRNG.B_ROW);
}

function mod(a, b) {
	return (a % b) + (a < 0 ? b : 0);
}


return PRNGStream;
})();

function MutableUint64(high, row) {
	this.high = high;
	this.row = row;
}

MutableUint64.prototype.set = function(high, row) {
	this.high = high;
	this.row = row;
};

MutableUint64.prototype.add = function(o_high, o_row) {
	var row = this.row + o_row;
	var carry = row > 0xffffffff;
	this.row = u32(row);
	this.high = u32(this.high + o_high + (carry ? 1 : 0));
	return this;
};

MutableUint64.prototype.add_shift = function(other, shift) {
	var row, high;
	if (shift < 32) {
		row = u32(other << shift);
		high = shift == 0 ? 0 : other >>> (32 - shift);
	} else {
		row = 0;
		high = u32(other << (shift - 32));
	}
	this.add(high, row);
};

MutableUint64.prototype.mul = function(o_high, o_row) {
	var a = this.high >>> 16, b = this.high & 0xffff, c = this.row >>> 16, d = this.row & 0xffff;
	var e =    o_high >>> 16, f =    o_high & 0xffff, g =    o_row >>> 16, h =    o_row & 0xffff;
	
	this.high = this.row = 0;
	
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
	return (0x100000000 + this.high).toString(16).slice(1) + (0x100000000 + this.row).toString(16).slice(1);
}

function u32(x) {
	return x >>> 0;
}
