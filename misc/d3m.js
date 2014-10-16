/**
<a href="http://sprocket.babyblue.jp/html/hsp_d3m.htm">d3m.hsp</a> をcoffeescript/javascriptに移植したものです。
@see <a href="https://github.com/eller86/d3m.js">repository on GitHub</a>
@author <a href="http://skypencil.jp/">eller86</a>
@class D3M
*/
var D3M;
D3M = (function() {
  function D3M(context, width, height) {
    this.context = context;
    this.width = width != null ? width : 320;
    this.height = height != null ? height : 320;
  }
  /**
  入力された x, y, z の距離 (ベクトル) の絶対値 ( sqrt(x*x + y*y + z*z) ) を返す関数です。
  
  z 座標を省略すれば平面座標での距離を求めることができます。
  @param {Number} x
  @param {Number} [y]
  @param {Number} [z]
  */
  D3M.prototype.d3dist = function(x, y, z) {
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    return Math.sqrt(x * x + y * y + z * z);
  };
  /**
  平面上のベクトル (あるいは位置) x0, y0 を、原点を中心に va [ラジアン] 回転させたベクトルを求めます。計算結果は、x, y をプロパティに持つオブジェクトとして返されます。
  
  角度は、ラジアン単位 (2π ≒ 6.2831853 を一回転とする角度単位) で入力します。
  @param {Number} x0 回転させるベクトルのx方向の大きさ
  @param {Number} y0 回転させるベクトルのy方向の大きさ
  @param {Number} va 回転量（ラジアン）
  */
  D3M.prototype.d3rotate = function(x0, y0, va) {
    return {
      x: x0 * Math.cos(va) - y0 * Math.sin(va),
      y: x0 * Math.sin(va) + y0 * Math.cos(va)
    };
  };
  D3M.prototype.d3vrotate = function(x0, y0, z0, vx, vy, vz, va) {
    var ax, ay, az, cos, l_cos, r, sin;
    r = this.d3dist(vx, vy, vz);
    ax = vx / r;
    ay = vy / r;
    az = vz / r;
    sin = Math.sin(va);
    cos = Math.cos(va);
    l_cos = 1.0 - cos;
    return {
      x: (ax * ax * l_cos + cos) * x0 + (ax * ay * l_cos - az * sin) * y0 + (az * ax * l_cos - ax * sin) * z0,
      y: (ax * ay * l_cos + az * sin) * x0 + (ay * ay * l_cos + cos) * y0 + (ay * az * l_cos - ax * sin) * z0,
      z: (az * ax * l_cos - ay * sin) * x0 + (ay * az * l_cos + ax * sin) * y0 + (az * az * l_cos + cos) * z0
    };
  };
  D3M.prototype.d3setlocal = function(LGmpx, LGmpy, LGmpz, LGm00, LGm10, LGm20, LGm01, LGm11, LGm21, LGm02, LGm12, LGm22) {
    if (LGmpx == null) {
      LGmpx = 0;
    }
    if (LGmpy == null) {
      LGmpy = 0;
    }
    if (LGmpz == null) {
      LGmpz = 0;
    }
    if (LGm00 == null) {
      LGm00 = 1;
    }
    if (LGm10 == null) {
      LGm10 = 0;
    }
    if (LGm20 == null) {
      LGm20 = 0;
    }
    if (LGm01 == null) {
      LGm01 = 0;
    }
    if (LGm11 == null) {
      LGm11 = 1;
    }
    if (LGm21 == null) {
      LGm21 = 0;
    }
    if (LGm02 == null) {
      LGm02 = 0;
    }
    if (LGm12 == null) {
      LGm12 = 0;
    }
    if (LGm22 == null) {
      LGm22 = 1;
    }
    this.LGSm00 = this.GSm00 * LGm00 + this.GSm10 * LGm01;
    this.LGSm10 = this.GSm00 * LGm10 + this.GSm10 * LGm11;
    this.LGSm20 = this.GSm00 * LGm20 + this.GSm10 * LGm21;
    this.LGSmpx = this.GSm00 * LGmpx + this.GSm10 * LGmpy + this.GSmpx;
    this.LGSm01 = this.GSm01 * LGm00 + this.GSm11 * LGm01 + this.GSm21 * LGm02;
    this.LGSm11 = this.GSm01 * LGm10 + this.GSm11 * LGm11 + this.GSm21 * LGm12;
    this.LGSm21 = this.GSm01 * LGm20 + this.GSm11 * LGm21 + this.GSm21 * LGm22;
    this.LGSmpy = this.GSm01 * LGmpx + this.GSm11 * LGmpy + this.GSm21 * LGmpz + this.GSmpy;
    this.LGSm02 = this.GSm02 * LGm00 + this.GSm12 * LGm01 + this.GSm22 * LGm02;
    this.LGSm12 = this.GSm02 * LGm10 + this.GSm12 * LGm11 + this.GSm22 * LGm12;
    this.LGSm22 = this.GSm02 * LGm20 + this.GSm12 * LGm21 + this.GSm22 * LGm22;
    this.LGSmpz = this.GSm02 * LGmpx + this.GSm12 * LGmpy + this.GSm22 * LGmpz + this.GSmpz;
  };
  D3M.prototype.d3setcam = function(cpx, cpy, cpz, ppx, ppy, ppz, ppv) {
    var ax, ay, az, cos0, cos1, r0, r1, sin0, sin1;
    if (cpx == null) {
      cpx = 0;
    }
    if (cpy == null) {
      cpy = 0;
    }
    if (cpz == null) {
      cpz = 0;
    }
    if (ppx == null) {
      ppx = 0;
    }
    if (ppy == null) {
      ppy = 0;
    }
    if (ppz == null) {
      ppz = 0;
    }
    if (ppv == null) {
      ppv = 1;
    }
    this.wincx = this.width / 2;
    this.wincy = this.height / 2;
    ax = cpx - ppx;
    ay = cpy - ppy;
    az = cpz - ppz;
    r0 = Math.sqrt(ax * ax + ay * ay);
    r1 = Math.sqrt(r0 * r0 + az * az);
    if (r0 !== 0.0) {
      cos0 = -ax / r0;
      sin0 = -ay / r0;
    }
    if (r1 !== 0.0) {
      cos1 = r0 / r1;
      sin1 = az / r1;
    }
    az = ppv / (0.01 + this.height);
    this.GSm00 = sin0;
    this.GSm10 = -cos0;
    this.GSm01 = cos0 * cos1 * az;
    this.GSm11 = sin0 * cos1 * az;
    this.GSm21 = -sin1 * az;
    this.GSm02 = cos0 * sin1;
    this.GSm12 = sin0 * sin1;
    this.GSm22 = cos1;
    this.GSmpx = -(this.GSm00 * cpx + this.GSm10 * cpy);
    this.GSmpy = -(this.GSm01 * cpx + this.GSm11 * cpy + this.GSm21 * cpz);
    this.GSmpz = -(this.GSm02 * cpx + this.GSm12 * cpy + this.GSm22 * cpz);
    this.d3setlocal(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1);
  };
  D3M.prototype.d3trans = function(x, y, z) {
    this.dz = this.LGSm01 * x + this.LGSm11 * y + this.LGSm21 * z + this.LGSmpy;
    this.df = false;
    if (this.dz > 0) {
      this.dx = this.wincx + (this.LGSm00 * x + this.LGSm10 * y + this.LGSm20 * z + this.LGSmpx) / this.dz;
      this.dy = this.wincy - (this.LGSm02 * x + this.LGSm12 * y + this.LGSm22 * z + this.LGSmpz) / this.dz;
      this.df = this.dx < 8000 && this.dy < 8000;
    }
  };
  D3M.prototype.d3vpos = function(x, y, z) {
    var _ref;
    _ref = [this.dx, this.dy, this.df], this.ex = _ref[0], this.ey = _ref[1], this.ef = _ref[2];
    this.d3trans(x, y, z);
  };
  D3M.prototype.d3getpos = function(x, y, z) {
    this.d3vpos(x, y, z);
    if (this.df) {
      return {
        x: this.dx,
        y: this.dy
      };
    }
    return null;
  };
  D3M.prototype.d3pos = function(x, y, z) {
    this.d3vpos(x, y, z);
    if (this.df) {
      this.context.moveTo(this.dx, this.dy);
    }
  };
  D3M.prototype.d3initlineto = function() {
    this.df = false;
  };
  D3M.prototype.d3pset = function(x, y, z) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    throw 'unsupported operation';
  };
  D3M.prototype.d3lineto = function(x, y, z) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    this.d3vpos(x, y, z);
    if (this.df && this.ef) {
      return this.context.lineTo(this.dx, this.dy);
    }
  };
  D3M.prototype.d3line = function(ppx, ppy, ppz, ssx, ssy, ssz) {
    var ax, ay, az, bY, bx, bz, cnt, cx, cy, cz, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
    if (ppx == null) {
      ppx = 0;
    }
    if (ppy == null) {
      ppy = 0;
    }
    if (ppz == null) {
      ppz = 0;
    }
    if (ssx == null) {
      ssx = 0;
    }
    if (ssy == null) {
      ssy = 0;
    }
    if (ssz == null) {
      ssz = 0;
    }
    this.d3vpos(ssx, ssy, ssz);
    this.d3vpos(ppx, ppy, ppz);
    if (this.df && this.ef) {
      this.context.moveTo(this.ex, this.ey);
      this.context.lineTo(this.dx, this.dy);
      return;
    }
    if (this.df || this.ef) {
      if (this.df) {
        this.context.moveTo(this.dx, this.dy);
        _ref = [ppx, ppy, ppz], ax = _ref[0], ay = _ref[1], az = _ref[2];
        _ref2 = [ssx, ssy, ssz], bx = _ref2[0], bY = _ref2[1], bz = _ref2[2];
      } else {
        this.context.moveTo(this.ex, this.ey);
        _ref3 = [ssx, ssy, ssz], ax = _ref3[0], ay = _ref3[1], az = _ref3[2];
        _ref4 = [ppx, ppy, ppz], bx = _ref4[0], bY = _ref4[1], bz = _ref4[2];
      }
      for (cnt = 0; cnt <= 9; cnt++) {
        cx = (ax + bx) / 2;
        cy = (ay + bY) / 2;
        cz = (az + bz) / 2;
        this.d3trans(cx, cy, cz);
        if (this.df) {
          _ref5 = [cx, cy, cz], ax = _ref5[0], ay = _ref5[1], az = _ref5[2];
          this.context.lineTo(this.dx, this.dy);
        } else {
          _ref6 = [cx, cy, cz], bx = _ref6[0], bY = _ref6[1], bz = _ref6[2];
        }
      }
    }
  };
  D3M.prototype.d3arrow = function(x1, y1, z1, x2, y2, z2) {
    var a, bY, bx, r;
    this.d3line(x1, y1, z1, x2, y2, z2);
    if (this.df && this.ef) {
      a = Math.atan2(this.dy - this.ey, this.dx - this.ex);
      this.d3vpos((x1 * 6 + x2) / 7, (y1 * 6 + y2) / 7, (z1 * 6 + z2) / 7);
      r = this.d3dist(x1 - x2, y1 - y2, z1 - z2) / this.dz / 25;
      bx = Math.cos(a) * r;
      bY = Math.sin(a) * r;
      this.context.moveTo(this.dx - bY, this.dy + bx);
      this.context.lineTo(this.ex, this.ey);
      this.context.lineTo(this.dx + bY, this.dy - bx);
    }
  };
  D3M.prototype.d3box = function(v11, v12, v13, v14, v15, v16) {
    this.d3line(v11, v12, v13, v11, v12, v16);
    this.d3line(v11, v12, v16, v11, v15, v16);
    this.d3line(v11, v15, v16, v11, v15, v13);
    this.d3line(v11, v15, v13, v11, v12, v13);
    this.d3line(v14, v12, v13, v14, v15, v13);
    this.d3line(v14, v15, v13, v14, v15, v16);
    this.d3line(v14, v15, v16, v14, v12, v16);
    this.d3line(v14, v12, v16, v14, v12, v13);
    this.d3line(v11, v12, v13, v14, v12, v13);
    this.d3line(v11, v12, v16, v14, v12, v16);
    this.d3line(v11, v15, v16, v14, v15, v16);
    this.d3line(v11, v15, v13, v14, v15, v13);
  };
  D3M.prototype.d3circle = function(x, y, z, r, flg) {
    this.d3vpos(x, y, z);
    if (this.df) {
      r = r / this.dz;
      this.context.moveTo(this.dx + r, this.dy);
      this.context.arc(this.dx, this.dy, r, 0, Math.PI * 2, false);
    }
  };
  D3M.prototype.d3mes = function(s, x, y, z) {
    var metrics;
    this.d3vpos(x, y, z);
    if (this.df) {
      metrics = this.context.measureText(s);
      this.context.strokeText(s, this.dx - metrics.width / 2, this.dy);
    }
  };
  return D3M;
})();