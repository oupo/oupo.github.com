start_test(function() {


test_title("add");
test_add(0x00000000, 0x00000002, 0x00000000, 0x00000003, 0x00000000, 0x00000005);
test_add(0x00000002, 0x00000000, 0x00000003, 0x00000000, 0x00000005, 0x00000000);

test_add(0xaa36be55, 0x44f8df60, 0xaad77b1b, 0x34a689af, 0x550e3970, 0x799f690f);
test_add(0x7e757ef4, 0x4e8ed776, 0x97e1c15c, 0x790be427, 0x16574050, 0xc79abb9d);
test_add(0x42a26bae, 0x846d6843, 0x6d1edb52, 0xdad7531f, 0xafc14701, 0x5f44bb62);
test_add(0xd17e35fd, 0x74d1c6f7, 0xd6997ce6, 0x0e5cbba3, 0xa817b2e3, 0x832e829a);
test_add(0x2e4adbc3, 0xdbc2968a, 0xd57ca7ac, 0xd25c44c0, 0x03c78370, 0xae1edb4a);
test_add(0xa238e3cf, 0x33ecf2c5, 0xf1d4e8c5, 0xaf270ead, 0x940dcc94, 0xe3140172);
test_add(0x7cd121c9, 0xe3473ed1, 0x2fed2146, 0x40c60c1b, 0xacbe4310, 0x240d4aec);
test_add(0x9e9711a5, 0x2e6597f5, 0x2af25eeb, 0xca0e22dc, 0xc9897090, 0xf873bad1);
test_add(0x873e49ef, 0x969a0f48, 0xe0930c59, 0xa6a520b5, 0x67d15649, 0x3d3f2ffd);
test_add(0xe1aa18ac, 0x886d8adf, 0xbbf27789, 0xda1babc1, 0x9d9c9036, 0x628936a0);

test_title("mul");
test_mul(0x00000000, 0x00000002, 0x00000000, 0x00000003, 0x00000000, 0x00000006);
test_mul(0x00000000, 0x00020000, 0x00000000, 0x00030000, 0x00000006, 0x00000000);

test_mul(0xcb1bab00, 0xaa016933, 0xa9649c54, 0x89fba097, 0x8451510f, 0x9895ed15);
test_mul(0x94cce48d, 0xefab3486, 0x517ee753, 0xfa2283e6, 0xf0cbf0a3, 0xc57dc264);
test_mul(0x7b1b53fc, 0x883e7655, 0x677dd78d, 0x8c156d87, 0x06aeb5d5, 0xa24b97d3);
test_mul(0xba21d62d, 0x34e85fcd, 0x6bd7eb59, 0x130bee76, 0xa87ac263, 0xc0fbbe7e);
test_mul(0x9144edc6, 0xf1ef732e, 0x948373ac, 0x69565223, 0x10cfc548, 0x56157b4a);
test_mul(0x3a416a37, 0xbbc1aada, 0x484c4fe0, 0xfd3c4cb8, 0x5a120fc9, 0xef0384b0);
test_mul(0x0c1305d4, 0xc6e0454b, 0x95b19b1c, 0xddddeb9f, 0xc8e13a58, 0xf5a5e295);
test_mul(0x77f21822, 0xf7fb7430, 0x2d96e2ef, 0x1c939716, 0xceb2722f, 0x98b44c20);
test_mul(0xb25cb151, 0x3298e199, 0xfa613983, 0x6760f28c, 0x278db8a0, 0x593e01ac);
test_mul(0x721379aa, 0x6583bef7, 0x488eb2f9, 0x5a8184ee, 0x0c52ed87, 0x5f69e5a2);


// + ((a1b0 + a0b1) << 16) を + (u32(a1b0 + a0b1) << 16) とすると失敗になる例
test_mul(0x08d1dd28, 0xeb26d24e, 0x4d5a2200, 0x5a78edc1, 0x8b2ad9ae, 0x3986c2ce);

test_seeds(0x00000000, 0x00000000, 10000, [
	[0x00000000, 0x00269ec3,    0],
	[0x7188d00c, 0x55ae9cb2, 4434],
	[0x0af528d3, 0xa0c3b2fd,  428],
	[0x0a8b4e34, 0xc910a194,  411],
	[0xc83fb970, 0x153a9227, 7822],
	[0x0c45453a, 0x2b8a2726,  479],
	[0xcc28fe89, 0x36a566c1, 7975],
	[0x22967565, 0x4eac71e8, 1351],
	[0x38c7575f, 0x507cb74b, 2217],
	[0x67795501, 0x267f125a, 4041]]);

test_step(0x00000000, 0x00000000, 10000, 200);
test_step_double(0x00000000, 0x00000000, 31);
test_advancement(0x00000000, 0x00000000, 5, 100);
test_reverse(0x00000000, 0x00000000, 10000, 200);
test_max(0xffffffff, 0, [
	[1, 0],
	[2, 1],
	[10, 9],
	[100, 99],
	[1000, 999],
	[10000, 9999],
	[100000, 99999],
	[1000000, 999999],
	[10000000, 9999999],
	[100000000, 99999999],
	[1000000000, 999999999],
	[0xffffffff, 0xfffffffe]]);

test_title("big_gen_rand");
test_big_gen_rand(0x05a8ed83, 0x05a876d5, 0x0020061f);
test_big_gen_rand(0xe9f70919, 0xafed3371, 0xa0c8a7ee);

test_stream(0x00000000, 0x00000000, 100, 3, 5, 5, 10000);
test_stream_step(0x00000000, 0x00000000, 100, 2, 3, 1, 101, 10000);
test_stream_prev(0x00000000, 0x00000000, 100);

});

(function() {
	var start_time = new Date().getTime();
	var prng = new PRNG(0, 0);
	for (var i = 0; i < 20000; i ++) {
		prng.rand(10000);
	}
	var end_time = new Date().getTime();
	print("benchmark: "+(end_time - start_time)+" ms");
})();


function test_add(a_high, a_low, b_high, b_low, r_high, r_low) {
	var x = new MutableUint64(a_high, a_low);
	x.add(b_high, b_low);
	test([x.high, x.low], [r_high, r_low]);
}

function test_mul(a_high, a_low, b_high, b_low, r_high, r_low) {
	var x = new MutableUint64(a_high, a_low);
	x.mul(b_high, b_low);
	test([x.high, x.low], [r_high, r_low]);
}

function test_seeds(high, low, max, expected_values) {
	test_title("seeds");
	var prng = new PRNG(high, low);
	for (var i = 0; i < expected_values.length; i ++) {
		var e_high = expected_values[i][0],
		    e_low = expected_values[i][1],
		    e_val = expected_values[i][2];
		var val = prng.rand(max);
		var high = prng.seed.high, low = prng.seed.low;
		test([high, low, val], [e_high, e_low, e_val]);
	}
}

function test_step(high, low, max, times) {
	test_title("step");
	var prng = new PRNG(high, low);
	var seeds = [];
	for (var i = 0; i < times; i ++) {
		var h = prng.seed.high, r = prng.seed.low;
		var val = prng.rand(max);
		seeds[i] = [h, r, val];
	}
	for (var i = 0; i < times; i ++) {
		var prng = new PRNG(high, low);
		prng.step(i);
		var h = prng.seed.high, r = prng.seed.low;
		var val = prng.rand(max);
		test([h, r, val], seeds[i]);
	}
}

function test_step_double(high, low, times) {
	test_title("step_double");
	var n = 1;
	for (var i = 0; i < times; i ++) {
		var prng = new PRNG(high, low);
		prng.step(n);
		prng.step(n);
		var h = prng.seed.high, r = prng.seed.low;
		var prng = new PRNG(high, low);
		prng.step(n * 2);
		test([prng.seed.high, prng.seed.low], [h, r]);
		n *= 2;
	}
}

function test_advancement(high, low, times, step_num) {
	test_title("advancement");
	var prng = new PRNG(high, low);
	var a = 0;
	for (var i = 0; i < times; i ++) {
		test([prng.advancement], [a]);
		prng.rand(1);
		a ++;
	}
	test([prng.advancement], [a]);
	prng.step(step_num);
	a += step_num;
	for (var i = 0; i < times; i ++) {
		test([prng.advancement], [a]);
		prng.rand(1);
		a ++;
	}
}

function test_reverse(high, low, max, times) {
	test_title("reverse");
	var prng = new PRNG(high, low);
	var seeds = [];
	for (var i = 0; i < times; i ++) {
		var high = prng.seed.high, low = prng.seed.low;
		var val = prng.rand(max);
		seeds[i] = [high, low, val];
	}
	for (var i = 0; i < times; i ++) {
		var val = prng.reverse_rand(max);
		var high = prng.seed.high, low = prng.seed.low;
		test([high, low, val], seeds[times-1-i]);
	}
}

function test_max(high, low, values) {
	test_title("max");
	for (var i = 0; i < values.length; i ++) {
		var max = values[i][0], expected = values[i][1];
		var prng = new PRNG(high, low);
		var val = prng.reverse_rand(max);
		test([val], [expected]);
	}
}

function test_big_gen_rand(high, max, expected) {
	test([PRNG.gen_rand(high, max)], [expected]);
}

function test_stream(high, low, advancement, buffer_size, times, inner_times, max) {
	test_title("stream");
	var prng = new PRNG(high, low);
	prng.step(advancement);
	var stream = new PRNGStream(high, low, advancement, buffer_size, 0);
	
	for (var i = 0; i < times; i ++) {
		var p = new PRNG(prng.seed.high, prng.seed.low);
		var p2 = stream.next();
		
		for (var j = 0; j < inner_times; j ++) {
			test([p.rand(max)], [p2.rand(max)]);
			test([p.advancement], [p2.advancement]);
		}
		
		prng.step(1);
	}
}

function test_stream_step(high, low, advancement, buffer_size, times, inner_times, step_num, max) {
	test_title("stream_step");
	var prng = new PRNG(high, low);
	prng.step(advancement);
	var stream = new PRNGStream(high, low, advancement, buffer_size, 0);
	
	for (var i = 0; i < times; i ++) {
		var p = new PRNG(prng.seed.high, prng.seed.low);
		var p2 = stream.next();
		
		for (var j = 0; j < 2; j ++) {
			for (var k = 0; k < inner_times; k ++) {
				test([p2.rand(max)], [p.rand(max)]);
				test([p2.advancement], [p.advancement]);
			}
			
			p.step(step_num);
			p2.step(step_num);
			test([p2.rand(max)], [p.rand(max)]);
			test([p2.advancement], [p.advancement]);
		}
		prng.step(1);
	}
}

function test_stream_prev(high, low, advancement) {
	test_title("stream_prev");
	var step = 6;
	var prng = new PRNG(high, low);
	prng.step(advancement + step);
	
	
	var stream = new PRNGStream(high, low, advancement, 5, 5);
	for (i = 0; i < step; i ++) { stream.next(); }
	var prng2 = stream.next();
	var a = 0;
	
	for (var i = 0; i < 3; i ++) {
		prng.rand(1);
		prng2.rand(1);
		a ++;
	}
	var n = -4;
	a += n;
	prng.step(n);
	prng2.step(n);
	
	for (var i = 0; i < 3; i ++) {
		var val = prng.reverse_rand(10000);
		var val2 = prng2.reverse_rand(10000);
		a --;
		test([val2], [val]);
		test([prng2.advancement], [a]);
	}

}


//--------------------------------------------------

var TestResult;

function start_test(fn) {
	TestResult = {num_tests: 0, num_fail: 0,
	              current_block: {title: null, num_tests: 0, num_fail: 0}};
	fn();
	print_last_block_result();
	print(TestResult.num_tests+" tests, "+TestResult.num_fail+" fail");
}

function test(val, expected) {
	if (!array_eq(val, expected)) {
		TestResult.num_fail ++;
		TestResult.current_block.num_fail ++;
		print("fail: "+TestResult.current_block.title+"#"+TestResult.current_block.num_tests+" "+array_hex_inspect(val)+", "+array_hex_inspect(expected));
	}
	TestResult.current_block.num_tests ++;
	TestResult.num_tests ++;
}

function array_hex_inspect(array) {
	return "[" + array/*.map(function(i){return format_hex(i, 8)})*/.join(", ") + "]";
}

function test_title(title) {
	print_last_block_result();
	TestResult.current_block.title = title;
	TestResult.current_block.num_tests = 0;
	TestResult.current_block.num_fail = 0;
}

function print_last_block_result() {
	if (TestResult.current_block.title === null && TestResult.current_block.num_tests === 0) {
		return;
	}
	print(TestResult.current_block.title+": "+TestResult.current_block.num_tests+" tests, "+TestResult.current_block.num_fail+" fail");
}

function format_hex(n, prec) {
	var s = n.toString(16);
	return "0x" + (str_repeat("0", prec - s.length) + s);
}

function str_repeat(s, n) {
	var r = "";
	for (var i = 0; i < n; i ++) {
		r += s;
	}
	return r;
}

function array_eq(a, b) {
	if (a == b) return true;
	if (a.length != b.length) return false;
	var l = a.length;
	for (var i = 0; i < l; i ++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
