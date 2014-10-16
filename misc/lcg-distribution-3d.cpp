// emcc -O2 lcg-distribution-3d.cpp -o lcg-distribution-3d.js -s EXPORTED_FUNCTIONS="['_set_params', '_count']" -g0 -s ASYNCIFY=1 -s RESERVED_FUNCTION_POINTERS=2

#include <stdio.h>
#include <stdint.h>
#include <emscripten.h>
typedef uint32_t u32;
typedef uint64_t u64;
u32 A, B;
int nBits;
u32 mask;
int length;

extern "C" {

void set_params(u32 _A, u32 _B, int _nBits, int _length) {
	A = _A;
	B = _B;
	nBits = _nBits;
	mask = nBits < 32 ? (1u << nBits) - 1 : 0xffffffff;
	length = _length;
}

u32 nxt(u32 x) {
	return (A * x + B) & mask;
}

void count(void(*put)(int,int,int), void(*notify)(const char *)) {
	u32 i = 0;
	u32 s = 0;
	u32 end = nBits < 32 ? (1<<nBits) : 0;
	do {
		if ((i & 0xfffff) == 0) {
			char s[256];
			sprintf(s, "%.8x", i);
			notify(s);
			emscripten_sleep(0);
		}
		u32 x, y, z;
		x = s = nxt(s);
		y = s = nxt(s);
		z = s = nxt(s);
		if (x < length && y < length && z < length) {
			put(x, y, z);
		}
	} while (++i != end);
	notify("finish");
}
}
