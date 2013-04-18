var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = traceur.runtime.elementGet(names, i);
    traceur.runtime.elementSet(descriptors, name, Object.getOwnPropertyDescriptor(object, name));
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
}, $__toObject = function(value) {
  if (value == null) throw TypeError();
  return Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(traceur.runtime.elementGet(arguments, i));
    for (var j = 0; j < value.length; j++) {
      traceur.runtime.elementSet(rv, k++, traceur.runtime.elementGet(value, j));
    }
  }
  return rv;
};
var $__10;
var $__env_js = (function() {
  try {
    throw undefined;
  } catch (Env) {
    try {
      throw undefined;
    } catch (Entry) {
      "use strict";
      Entry = function() {
        'use strict';
        var $Entry = ($__createClassNoExtends)({
          constructor: function(id, item, pokemon, nature) {
            this.id = id;
            this.item = item;
            this.pokemon = pokemon;
            this.nature = nature;
          },
          collides_with: function(other) {
            return this.item == other.item || this.pokemon == other.pokemon;
          },
          collides_within: function(entries) {
            return entries.some((function(x) {
              return this.collides_with(x);
            }).bind(this));
          }
        }, {});
        return $Entry;
      }();
      Env = function() {
        'use strict';
        var $Env = ($__createClassNoExtends)({constructor: function(options) {
            this.nParty = options.nParty;
            this.nStarters = options.nStarters;
            this.nBattles = options.nBattles;
            this.allEntries = options.allEntries;
          }}, {});
        return $Env;
      }();
      return Object.preventExtensions(Object.create(null, {
        Entry: {
          get: function() {
            return Entry;
          },
          enumerable: true
        },
        Env: {
          get: function() {
            return Env;
          },
          enumerable: true
        }
      }));
    }
  }
}).call(this);
var $__prng_js = (function() {
  try {
    throw undefined;
  } catch (u32) {
    try {
      throw undefined;
    } catch (mul) {
      try {
        throw undefined;
      } catch (make_const) {
        try {
          throw undefined;
        } catch (PRNG) {
          try {
            throw undefined;
          } catch (B) {
            try {
              throw undefined;
            } catch (A) {
              "use strict";
              {
                A = 0x41c64e6d;
                B = 0x6073;
              }
              PRNG = function() {
                'use strict';
                var $PRNG = ($__createClassNoExtends)({
                  constructor: function(seed) {
                    this.seed = seed;
                  },
                  rand: function(n) {
                    try {
                      throw undefined;
                    } catch (prngp) {
                      prngp = this.dup();
                      return [prngp, prngp.randQ(n)];
                    }
                  },
                  randQ: function(n) {
                    this.succ();
                    return (this.seed >>> 16) % n;
                  },
                  succ: function() {
                    this.seed = u32(mul(this.seed, A) + B);
                  },
                  stepQ: function(n) {
                    try {
                      throw undefined;
                    } catch (b) {
                      try {
                        throw undefined;
                      } catch (a) {
                        try {
                          throw undefined;
                        } catch ($__9) {
                          {
                            $__9 = make_const(n);
                            a = traceur.runtime.elementGet($__9, 0);
                            b = traceur.runtime.elementGet($__9, 1);
                          }
                          this.seed = u32(mul(this.seed, a) + b);
                        }
                      }
                    }
                  },
                  dup: function() {
                    return new PRNG(this.seed);
                  }
                }, {});
                return $PRNG;
              }();
              make_const = function(n) {
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
                return [c, d];
              };
              mul = function(a, b) {
                var a1 = a >>> 16, a2 = a & 0xffff;
                var b1 = b >>> 16, b2 = b & 0xffff;
                return u32(((a1 * b2 + a2 * b1) << 16) + a2 * b2);
              };
              u32 = function(x) {
                return x >>> 0;
              };
              return Object.preventExtensions(Object.create(null, {PRNG: {
                  get: function() {
                    return PRNG;
                  },
                  enumerable: true
                }}));
            }
          }
        }
      }
    }
  }
}).call(this);
var $__util_js = (function() {
  try {
    throw undefined;
  } catch (Util) {
    try {
      throw undefined;
    } catch (defineMethod) {
      "use strict";
      Object.defineProperty(Array.prototype, "flatten", {
        value: function() {
          var ret = [];
          for (var i = 0; i < this.length; i++) {
            ($__10 = ret).push.apply($__10, $__toObject(traceur.runtime.elementGet(this, i)));
          }
          return ret;
        },
        configurable: true,
        enumerable: false,
        writable: true
      });
      defineMethod = function(object, name, func) {
        Object.defineProperty(object, name, {
          value: func,
          configurable: true,
          enumerable: false,
          writable: true
        });
      };
      defineMethod(Array.prototype, "include", function(x) {
        return this.indexOf(x) >= 0;
      });
      defineMethod(Array.prototype, "clone", function() {
        return this.slice(0);
      });
      defineMethod(Array.prototype, "count", function(predicate) {
        var num = 0;
        {
          var $__1 = traceur.runtime.getIterator(this);
          try {
            while (true) {
              var x = $__1.next();
              {
                if (predicate(x)) num += 1;
              }
            }
          } catch (e) {
            if (!traceur.runtime.isStopIteration(e)) throw e;
          }
        }
        return num;
      });
      defineMethod(Array.prototype, "diff", function(other) {
        return this.filter((function(x) {
          return !other.include(x);
        }));
      });
      defineMethod(Array.prototype, "cap", function(other) {
        return this.filter((function(x) {
          return other.include(x);
        }));
      });
      defineMethod(Array.prototype, "sortBy", function(func) {
        var keys = this.map(func);
        return Util.iota(this.length).sort((function(a, b) {
          return traceur.runtime.elementGet(keys, a) - traceur.runtime.elementGet(keys, b);
        })).map((function(i) {
          return traceur.runtime.elementGet(this, i);
        }).bind(this));
      });
      defineMethod(Array.prototype, "minBy", function(keyOf) {
        var min = null;
        {
          var $__2 = traceur.runtime.getIterator(this);
          try {
            while (true) {
              var x = $__2.next();
              {
                if (min == null || keyOf(x) < keyOf(min)) min = x;
              }
            }
          } catch (e) {
            if (!traceur.runtime.isStopIteration(e)) throw e;
          }
        }
        return min;
      });
      defineMethod(Array.prototype, "maxBy", function(keyOf) {
        var max = null;
        {
          var $__3 = traceur.runtime.getIterator(this);
          try {
            while (true) {
              var x = $__3.next();
              {
                if (max == null || keyOf(max) < keyOf(x)) max = x;
              }
            }
          } catch (e) {
            if (!traceur.runtime.isStopIteration(e)) throw e;
          }
        }
        return max;
      });
      defineMethod(Array.prototype, "max", function() {
        return this.maxBy((function(x) {
          return x;
        }));
      });
      defineMethod(Array.prototype, "findIndex", function(func) {
        for (var i = 0; i < this.length; i++) {
          if (func(traceur.runtime.elementGet(this, i))) return i;
        }
        return null;
      });
      defineMethod(Array.prototype, "find", function(func) {
        {
          var $__4 = traceur.runtime.getIterator(this);
          try {
            while (true) {
              var x = $__4.next();
              {
                if (func(x)) return x;
              }
            }
          } catch (e) {
            if (!traceur.runtime.isStopIteration(e)) throw e;
          }
        }
        return null;
      });
      defineMethod(Array.prototype, "isEmpty", function() {
        return this.length == 0;
      });
      Object.defineProperty(Array.prototype, "last", {
        get: function() {
          return traceur.runtime.elementGet(this, this.length - 1);
        },
        enumerable: false
      });
      Util = function() {
        'use strict';
        var $Util = ($__createClassNoExtends)({constructor: function() {}}, {
          split: function(str, sep) {
            var array = str.split(sep);
            if (array.last == "") array.pop();
            return array;
          },
          range: function(start, end) {
            var array = [];
            for (var i = start; i <= end; i++) {
              array.push(i);
            }
            return array;
          },
          iota: function(n) {
            return this.range(0, n - 1);
          },
          xhr: function(url) {
            var xhr = new XMLHttpRequest();
            var deferred = new Deferred;
            xhr.onload = function() {
              if (xhr.status == 200 || xhr.status == 0) {
                deferred.callback(xhr.responseText);
              } else {
                deferred.errback();
              }
            };
            xhr.onerror = function() {
              errback();
            };
            xhr.open("GET", url, true);
            xhr.send();
            return deferred;
          },
          hex: function(n) {
            var prec = traceur.runtime.elementGet(arguments, 1) !== (void 0) ? traceur.runtime.elementGet(arguments, 1): 8;
            var s = n.toString(16);
            return "0x" + (this.str_repeat("0", prec - s.length) + s);
          },
          str_repeat: function(s, n) {
            var r = "";
            for (var i = 0; i < n; i++) {
              r += s;
            }
            return r;
          }
        });
        return $Util;
      }();
      return Object.preventExtensions(Object.create(null, {Util: {
          get: function() {
            return Util;
          },
          enumerable: true
        }}));
    }
  }
}).call(this);
var $__factory_helper_js = (function() {
  try {
    throw undefined;
  } catch (FactoryHelper) {
    "use strict";
    var Util = $__util_js.Util;
    var $__9 = $__env_js, Entry = $__9.Entry, Env = $__9.Env;
    FactoryHelper = function() {
      'use strict';
      var $FactoryHelper = ($__createClassNoExtends)({constructor: function() {}}, {
        parseAllEntries: function(csvString) {
          try {
            throw undefined;
          } catch (NATURE_NAMES) {
            NATURE_NAMES = "がんばりや さみしがり ゆうかん いじっぱり やんちゃ ずぶとい すなお のんき わんぱく のうてんき おくびょう せっかち まじめ ようき むじゃき ひかえめ おっとり れいせい てれや うっかりや おだやか おとなしい なまいき しんちょう きまぐれ".split(" ");
            return Util.split(csvString, "\n").map((function(line, i) {
              try {
                throw undefined;
              } catch (nature) {
                try {
                  throw undefined;
                } catch (natureName) {
                  try {
                    throw undefined;
                  } catch (item) {
                    try {
                      throw undefined;
                    } catch (pokemon) {
                      try {
                        throw undefined;
                      } catch ($__9) {
                        {
                          $__9 = line.split(",");
                          pokemon = traceur.runtime.elementGet($__9, 0);
                          item = traceur.runtime.elementGet($__9, 1);
                          natureName = traceur.runtime.elementGet($__9, 2);
                        }
                        nature = NATURE_NAMES.indexOf(natureName);
                        return new Entry(i + 1, item, pokemon, nature);
                      }
                    }
                  }
                }
              }
            }));
          }
        },
        buildEnv: function(options) {
          var $that = this;
          var $state = 7;
          var $storedException;
          var $finallyFallThrough;
          var allEntries;
          var data;
          var url;
          var $value;
          var $err;
          var $result = new Deferred();
          var $waitTask;
          var $G = {
            GState: 0,
            current: undefined,
            yieldReturn: undefined,
            innerFunction: function($yieldSent, $yieldAction) {
              while (true) switch ($state) {
                case 7:
                  url = options.allEntriesURL;
                  $state = 8;
                  break;
                case 8:
                  ;
                  $state = 10;
                  break;
                case 10:
                  $waitTask = Util.xhr(url);
                  $waitTask.then($createCallback(1), $createErrback(2));
                  return;
                  $state = 1;
                  break;
                case 1:
                  data = $value;
                  $state = 3;
                  break;
                case 2:
                  throw $err;
                  $state = 3;
                  break;
                case 3:
                  allEntries = $that.parseAllEntries(data);
                  $state = 12;
                  break;
                case 12:
                  $result.callback(new Env({
                    nParty: options.nParty,
                    nStarters: options.nStarters,
                    nBattles: options.nBattles,
                    allEntries: allEntries
                  }));
                  $state = 5;
                  break;
                case 5:
                  $state = -2;
                  break;
                case 6:
                  $result.callback(undefined);
                  $state = -2;
                  break;
                case -2:
                  return;
                case -3:
                  $result.errback($storedException);
                  $state = -2;
                  break;
                default:
                  throw "traceur compiler bug: invalid state in state machine" + $state;
              }
            },
            moveNext: function($yieldSent, $yieldAction) {
              while (true) try {
                return this.innerFunction($yieldSent, $yieldAction);
              } catch ($caughtException) {
                $storedException = $caughtException;
                switch ($state) {
                  default:
                    $state = -3;
                    break;
                }
              }
            }
          };
          var $continuation = $G.moveNext.bind($G);
          var $createCallback = function($newState) {
            return function($0) {
              $state = $newState;
              $value = $0;
              $continuation();
            };
          };
          var $createErrback = function($newState) {
            return function($0) {
              $state = $newState;
              $err = $0;
              $continuation();
            };
          };
          $continuation();
          return $result.createPromise();
        },
        choose_entry: function(env, prng) {
          try {
            throw undefined;
          } catch (x) {
            try {
              throw undefined;
            } catch (prngp) {
              prngp = prng.dup();
              x = this.choose_entryQ(env, prngp);
              return [prngp, x];
            }
          }
        },
        choose_entryQ: function(env, prng) {
          try {
            throw undefined;
          } catch (last) {
            try {
              throw undefined;
            } catch (i) {
              i = prng.randQ(env.allEntries.length);
              last = env.allEntries.length - 1;
              return traceur.runtime.elementGet(env.allEntries, last - i);
            }
          }
        },
        choose_entries: function(env, prng, n) {
          try {
            throw undefined;
          } catch (x) {
            try {
              throw undefined;
            } catch (prngp) {
              var unchoosable = traceur.runtime.elementGet(arguments, 3) !== (void 0) ? traceur.runtime.elementGet(arguments, 3): [];
              prngp = prng.dup();
              x = this.choose_entriesQ(env, prngp, n, unchoosable);
              return [prngp, x];
            }
          }
        },
        choose_entriesQ: function(env, prng, n) {
          try {
            throw undefined;
          } catch (entries) {
            var unchoosable = traceur.runtime.elementGet(arguments, 3) !== (void 0) ? traceur.runtime.elementGet(arguments, 3): [];
            entries = [];
            while (entries.length < n) {
              try {
                throw undefined;
              } catch (entry) {
                entry = this.choose_entryQ(env, prng);
                if (!entry.collides_within($__spread(entries, unchoosable))) {
                  entries.push(entry);
                }
              }
            }
            return entries;
          }
        },
        choose_starters: function(env, prng) {
          try {
            throw undefined;
          } catch (starters) {
            try {
              throw undefined;
            } catch (prngp) {
              prngp = prng.dup();
              starters = this.choose_startersQ(env, prngp);
              return [prngp, starters];
            }
          }
        },
        choose_startersQ: function(env, prng) {
          try {
            throw undefined;
          } catch (starters) {
            starters = this.choose_entriesQ(env, prng, env.nStarters);
            this._pid_loopQ(env, prng, starters);
            prng.stepQ(2);
            return starters;
          }
        },
        after_consumption: function(env, prng, entries) {
          try {
            throw undefined;
          } catch (prngp) {
            prngp = prng.dup();
            this.after_consumptionQ(env, prngp, entries);
            return prngp;
          }
        },
        after_consumptionQ: function(env, prng, entries) {
          this._pid_loopQ(env, prng, entries);
          prng.stepQ(24);
        },
        _pid_loopQ: function(env, prng, entries) {
          {
            var $__5 = traceur.runtime.getIterator(entries);
            try {
              while (true) {
                try {
                  throw undefined;
                } catch (entry) {
                  entry = $__5.next();
                  {
                    try {
                      throw undefined;
                    } catch (trainer_id) {
                      trainer_id = this._rand32Q(prng);
                      while (true) {
                        try {
                          throw undefined;
                        } catch (pid) {
                          pid = this._rand32Q(prng);
                          if (pid % 25 == entry.nature) break;
                        }
                      }
                    }
                  }
                }
              }
            } catch (e) {
              if (!traceur.runtime.isStopIteration(e)) throw e;
            }
          }
        },
        _rand32Q: function(prng) {
          try {
            throw undefined;
          } catch (high) {
            try {
              throw undefined;
            } catch (low) {
              low = prng.randQ(0x10000);
              high = prng.randQ(0x10000);
              return (high << 16 | low) >>> 0;
            }
          }
        }
      });
      return $FactoryHelper;
    }();
    return Object.preventExtensions(Object.create(null, {FactoryHelper: {
        get: function() {
          return FactoryHelper;
        },
        enumerable: true
      }}));
  }
}).call(this);
var $__rough_js = (function() {
  try {
    throw undefined;
  } catch (OneEnemyPredictorResult) {
    try {
      throw undefined;
    } catch (OneEnemyPredictor) {
      try {
        throw undefined;
      } catch (RoughPredictorResult) {
        try {
          throw undefined;
        } catch (RoughPredictor) {
          "use strict";
          var Util = $__util_js.Util;
          var FactoryHelper = $__factory_helper_js.FactoryHelper;
          RoughPredictor = function() {
            'use strict';
            var $RoughPredictor = ($__createClassNoExtends)({
              constructor: function(env) {
                this.env = env;
              },
              predict: function(prng) {
                try {
                  throw undefined;
                } catch (starters) {
                  try {
                    throw undefined;
                  } catch (prngp) {
                    try {
                      throw undefined;
                    } catch ($__9) {
                      {
                        $__9 = FactoryHelper.choose_starters(this.env, prng);
                        prngp = traceur.runtime.elementGet($__9, 0);
                        starters = traceur.runtime.elementGet($__9, 1);
                      }
                      return this.predict0(prngp, [], [], starters);
                    }
                  }
                }
              },
              predict0: function(prng, enemies, skipped, starters) {
                try {
                  throw undefined;
                } catch (results) {
                  try {
                    throw undefined;
                  } catch (maybe_players) {
                    try {
                      throw undefined;
                    } catch (unchoosable) {
                      if (enemies.length == this.env.nBattles) {
                        return [new RoughPredictorResult(prng, enemies, skipped, starters)];
                      }
                      unchoosable = enemies.last || starters;
                      maybe_players = $__spread(starters, enemies.slice(0, - 1).flatten());
                      results = OneEnemyPredictor.predict(this.env, prng, unchoosable, maybe_players);
                      return results.map((function(result) {
                        try {
                          throw undefined;
                        } catch (prngp) {
                          prngp = FactoryHelper.after_consumption(env, result.prng, result.chosen);
                          return this.predict0(prngp, $__spread(enemies, [result.chosen]), $__spread(skipped, [result.skipped]), starters);
                        }
                      }).bind(this)).flatten();
                    }
                  }
                }
              }
            }, {predict: function(env, prng) {
                return new this(env).predict(prng);
              }});
            return $RoughPredictor;
          }();
          RoughPredictorResult = function() {
            'use strict';
            var $RoughPredictorResult = ($__createClassNoExtends)({constructor: function(prng, enemies, skipped, starters) {
                this.prng = prng;
                this.enemies = enemies;
                this.skipped = skipped;
                this.starters = starters;
              }}, {});
            return $RoughPredictorResult;
          }();
          OneEnemyPredictor = function() {
            'use strict';
            var $OneEnemyPredictor = ($__createClassNoExtends)({
              constructor: function(env, unchoosable, maybe_players) {
                this.env = env;
                this.unchoosable = unchoosable;
                this.maybe_players = maybe_players;
              },
              predict: function(prng) {
                return this.predict0(prng, [], []);
              },
              predict0: function(prng, skipped, chosen) {
                try {
                  throw undefined;
                } catch (x) {
                  try {
                    throw undefined;
                  } catch (prngp) {
                    try {
                      throw undefined;
                    } catch ($__9) {
                      if (chosen.length == this.env.nParty) {
                        return [new OneEnemyPredictorResult(prng, chosen, skipped)];
                      }
                      {
                        $__9 = FactoryHelper.choose_entry(this.env, prng);
                        prngp = traceur.runtime.elementGet($__9, 0);
                        x = traceur.runtime.elementGet($__9, 1);
                      }
                      if (x.collides_within($__spread(this.unchoosable, chosen, skipped))) {
                        return this.predict0(prngp, skipped, chosen);
                      } else if (!x.collides_within(this.maybe_players) || skipped.length == this.env.nParty) {
                        return this.predict0(prngp, skipped, $__spread(chosen, [x]));
                      } else {
                        try {
                          throw undefined;
                        } catch (result2) {
                          try {
                            throw undefined;
                          } catch (result1) {
                            result1 = this.predict0(prngp, skipped, $__spread(chosen, [x]));
                            result2 = this.predict0(prngp, $__spread(skipped, [x]), chosen);
                            return $__spread(result1, result2);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }, {predict: function(env, prng, unchoosable, maybe_players) {
                return new this(env, unchoosable, maybe_players).predict(prng);
              }});
            return $OneEnemyPredictor;
          }();
          OneEnemyPredictorResult = function() {
            'use strict';
            var $OneEnemyPredictorResult = ($__createClassNoExtends)({constructor: function(prng, chosen, skipped) {
                this.prng = prng;
                this.chosen = chosen;
                this.skipped = skipped;
              }}, {});
            return $OneEnemyPredictorResult;
          }();
          return Object.preventExtensions(Object.create(null, {
            RoughPredictor: {
              get: function() {
                return RoughPredictor;
              },
              enumerable: true
            },
            RoughPredictorResult: {
              get: function() {
                return RoughPredictorResult;
              },
              enumerable: true
            },
            OneEnemyPredictor: {
              get: function() {
                return OneEnemyPredictor;
              },
              enumerable: true
            },
            OneEnemyPredictorResult: {
              get: function() {
                return OneEnemyPredictorResult;
              },
              enumerable: true
            }
          }));
        }
      }
    }
  }
}).call(this);
var $__judge_js = (function() {
  try {
    throw undefined;
  } catch (Assigner) {
    try {
      throw undefined;
    } catch (Work) {
      try {
        throw undefined;
      } catch (Judge) {
        "use strict";
        var Util = $__util_js.Util;
        var FactoryHelper = $__factory_helper_js.FactoryHelper;
        Judge = function() {
          'use strict';
          var $Judge = ($__createClassNoExtends)({
            constructor: function(env, result) {
              this.env = env;
              this.shop = Util.range(0, this.env.nBattles).map((function(i) {
                if (i == 0) {
                  return result.starters.map((function(x) {
                    return x.item;
                  }));
                } else {
                  return traceur.runtime.elementGet(result.enemies, i - 1).map((function(x) {
                    return x.item;
                  }));
                }
              }));
              this.gate = Util.range(0, this.env.nBattles).map((function(i) {
                if (i >= 2) {
                  return traceur.runtime.elementGet(result.skipped, i - 1).map((function(x) {
                    return x.item;
                  }));
                }
              }));
            },
            judge: function() {
              try {
                throw undefined;
              } catch (schedule) {
                schedule = this.assign_works();
                return schedule != null && this.judge0(schedule);
              }
            },
            assign_works: function() {
              try {
                throw undefined;
              } catch (assigner) {
                assigner = new Assigner(this.env);
                {
                  var $__7 = traceur.runtime.getIterator(Util.range(2, this.env.nBattles));
                  try {
                    while (true) {
                      try {
                        throw undefined;
                      } catch (i) {
                        i = $__7.next();
                        {
                          {
                            var $__6 = traceur.runtime.getIterator(traceur.runtime.elementGet(this.gate, i));
                            try {
                              while (true) {
                                try {
                                  throw undefined;
                                } catch (item) {
                                  item = $__6.next();
                                  {
                                    try {
                                      throw undefined;
                                    } catch (work) {
                                      try {
                                        throw undefined;
                                      } catch (j) {
                                        j = Util.range(0, i - 2).filter((function(j) {
                                          return traceur.runtime.elementGet(this.shop, j).include(item);
                                        }).bind(this)).max();
                                        if (j == null) return null;
                                        work = new Work(item, j + 2, i);
                                        if (!assigner.assignable(work)) return null;
                                        assigner.assign(work);
                                      }
                                    }
                                  }
                                }
                              }
                            } catch (e) {
                              if (!traceur.runtime.isStopIteration(e)) throw e;
                            }
                          }
                        }
                      }
                    }
                  } catch (e) {
                    if (!traceur.runtime.isStopIteration(e)) throw e;
                  }
                }
                return assigner.assigned;
              }
            },
            judge0: function(schedule) {
              try {
                throw undefined;
              } catch (player) {
                player = null;
                {
                  var $__8 = traceur.runtime.getIterator(Util.range(2, this.env.nBattles));
                  try {
                    while (true) {
                      try {
                        throw undefined;
                      } catch (i) {
                        i = $__8.next();
                        {
                          if (i == 2) {
                            player = this.greedy_select_starters(schedule, i);
                          } else {
                            player = this.greedy_exchange(schedule, i, player);
                          }
                          if (!(player.cap(traceur.runtime.elementGet(this.shop, i)).isEmpty())) {
                            return false;
                          }
                        }
                      }
                    }
                  } catch (e) {
                    if (!traceur.runtime.isStopIteration(e)) throw e;
                  }
                }
                return true;
              }
            },
            greedy_select_starters: function(schedule, i) {
              try {
                throw undefined;
              } catch (items) {
                try {
                  throw undefined;
                } catch (sh) {
                  sh = traceur.runtime.elementGet(this.shop, i - 2);
                  items = schedule.filter((function(w) {
                    return w.head == i;
                  })).map((function(w) {
                    return w.item;
                  }));
                  return $__spread(items, (sh.diff(items).sortBy((function(item) {
                    return - this.caught(item, i);
                  }).bind(this)))).slice(0, this.env.nParty);
                }
              }
            },
            greedy_exchange: function(schedule, i, player) {
              try {
                throw undefined;
              } catch (work) {
                try {
                  throw undefined;
                } catch (a) {
                  try {
                    throw undefined;
                  } catch (player_desertable) {
                    try {
                      throw undefined;
                    } catch (current_works) {
                      try {
                        throw undefined;
                      } catch (sh) {
                        sh = traceur.runtime.elementGet(this.shop, i - 2);
                        current_works = schedule.filter((function(w) {
                          return w.range.include(i) && w.head != i;
                        }));
                        player_desertable = player.diff(current_works.map((function(w) {
                          return w.item;
                        })));
                        a = player_desertable.minBy((function(item) {
                          return this.caught(item, i);
                        }).bind(this));
                        work = schedule.find((function(w) {
                          return w.head == i;
                        }));
                        if (work) {
                          return $__spread(player.diff([a]), [work.item]);
                        } else {
                          try {
                            throw undefined;
                          } catch (b) {
                            b = sh.maxBy((function(item) {
                              return this.caught(item, i);
                            }).bind(this));
                            if (this.caught(a, i) < this.caught(b, i)) {
                              return $__spread(player.diff([a]), [b]);
                            } else {
                              return player;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            caught: function(item, pos) {
              try {
                throw undefined;
              } catch (i) {
                i = Util.range(pos, this.env.nBattles).find((function(i) {
                  return traceur.runtime.elementGet(this.shop, i).include(item);
                }).bind(this));
                return (i != null) ? i: this.env.nBattles + 1;
              }
            }
          }, {judge: function(env, result) {
              return new this(env, result).judge();
            }});
          return $Judge;
        }();
        Work = function() {
          'use strict';
          var $Work = ($__createClassNoExtends)({constructor: function(item, head, tail) {
              this.item = item;
              this.head = head;
              this.tail = tail;
              this.range = Util.range(head, tail);
            }}, {});
          return $Work;
        }();
        Assigner = function() {
          'use strict';
          var $Assigner = ($__createClassNoExtends)({
            constructor: function(env) {
              this.env = env;
              this.assigned = [];
            },
            assign: function(work) {
              try {
                throw undefined;
              } catch (assigned) {
                if (this.exist_similar_longer_work(work)) return;
                assigned = this.pick_similar_work(work);
                if (this.assignable0(assigned, work)) {
                  this.assigned = $__spread(assigned, [work]);
                } else {
                  throw "impossible";
                }
              }
            },
            assignable: function(work) {
              try {
                throw undefined;
              } catch (assigned) {
                if (this.exist_similar_longer_work(work)) {
                  return true;
                }
                assigned = this.pick_similar_work(work);
                return this.assignable0(assigned, work);
              }
            },
            assignable0: function(assigned, work) {
              return work.range.every((function(i) {
                return this.covered_num(assigned, i) < this.env.nParty;
              }).bind(this)) && this.startable_num(assigned, work.head) >= 1;
            },
            exist_similar_longer_work: function(work) {
              try {
                throw undefined;
              } catch (i) {
                i = this.find_similar_work(work);
                return i != null && work.tail <= traceur.runtime.elementGet(this.assigned, i).tail;
              }
            },
            find_similar_work: function(work) {
              return this.assigned.findIndex((function(w) {
                return w.item == work.item && w.head == work.head;
              }));
            },
            pick_similar_work: function(work) {
              try {
                throw undefined;
              } catch (i) {
                i = this.find_similar_work(work);
                if (i != null) {
                  var assigned = this.assigned.clone();
                  assigned.splice(i, 1);
                  return assigned;
                } else {
                  return this.assigned;
                }
              }
            },
            startable_num: function(assigned, pos) {
              try {
                throw undefined;
              } catch (max) {
                max = pos == 2 ? this.env.nParty: 1;
                return max - assigned.count((function(work) {
                  return work.head == pos;
                }));
              }
            },
            covered_num: function(assigned, pos) {
              return assigned.count((function(work) {
                return work.range.include(pos);
              }));
            }
          }, {});
          return $Assigner;
        }();
        return Object.preventExtensions(Object.create(null, {Judge: {
            get: function() {
              return Judge;
            },
            enumerable: true
          }}));
      }
    }
  }
}).call(this);
var $__predictor_js = (function() {
  try {
    throw undefined;
  } catch (Predictor) {
    "use strict";
    var Util = $__util_js.Util;
    var $__9 = $__rough_js, RoughPredictor = $__9.RoughPredictor, RoughPredictorResult = $__9.RoughPredictorResult, OneEnemyPredictor = $__9.OneEnemyPredictor, OneEnemyPredictorResult = $__9.OneEnemyPredictorResult;
    var Judge = $__judge_js.Judge;
    Predictor = function() {
      'use strict';
      var $Predictor = ($__createClassNoExtends)({constructor: function() {}}, {predict: function(env, prng) {
          return RoughPredictor.predict(env, prng).filter((function(r) {
            return Judge.judge(env, r);
          }));
        }});
      return $Predictor;
    }();
    return Object.preventExtensions(Object.create(null, {
      Entry: {
        get: function() {
          return $__env_js.Entry;
        },
        enumerable: true
      },
      Env: {
        get: function() {
          return $__env_js.Env;
        },
        enumerable: true
      },
      PRNG: {
        get: function() {
          return $__prng_js.PRNG;
        },
        enumerable: true
      },
      FactoryHelper: {
        get: function() {
          return $__factory_helper_js.FactoryHelper;
        },
        enumerable: true
      },
      Predictor: {
        get: function() {
          return Predictor;
        },
        enumerable: true
      }
    }));
  }
}).call(this);
var $__9 = $__predictor_js, Entry = $__9.Entry, Env = $__9.Env, PRNG = $__9.PRNG, FactoryHelper = $__9.FactoryHelper, Predictor = $__9.Predictor;
var Util = $__util_js.Util;
if (!(traceur.runtime.elementHas(window, 'console'))) window.console = {log: (function(x) {
    return x;
  })};
var env;
function main() {
  var $that = this;
  var $state = 0;
  var $storedException;
  var $finallyFallThrough;
  var $value;
  var $err;
  var $result = new Deferred();
  var $waitTask;
  var $G = {
    GState: 0,
    current: undefined,
    yieldReturn: undefined,
    innerFunction: function($yieldSent, $yieldAction) {
      while (true) switch ($state) {
        case 0:
          $waitTask = FactoryHelper.buildEnv({
            nParty: 3,
            nStarters: 6,
            nBattles: 7,
            allEntriesURL: "entries.csv"
          });
          $waitTask.then($createCallback(1), $createErrback(2));
          return;
          $state = 1;
          break;
        case 1:
          env = $value;
          $state = 3;
          break;
        case 2:
          throw $err;
          $state = 3;
          break;
        case 3:
          document.body.innerHTML = "\n\t\t<h1>factory-predictor Demo</h1>\n\t\t<form action=\"\" onsubmit=\"return false\">\n\t\tseed: <input type=\"text\" id=\"seed\" value=\"0\">\n\t\t<input type=\"submit\" value=\"実行\">\n\t\t</form>\n\t\t<div id=\"result\"></div>\n\t";
          $state = 5;
          break;
        case 5:
          document.querySelector("form").addEventListener("submit", (function() {
            exec(Number(document.querySelector("#seed").value));
          }), false);
          $state = 7;
          break;
        case 7:
          $result.callback(undefined);
          $state = -2;
          break;
        case -2:
          return;
        case -3:
          $result.errback($storedException);
          $state = -2;
          break;
        default:
          throw "traceur compiler bug: invalid state in state machine" + $state;
      }
    },
    moveNext: function($yieldSent, $yieldAction) {
      while (true) try {
        return this.innerFunction($yieldSent, $yieldAction);
      } catch ($caughtException) {
        $storedException = $caughtException;
        switch ($state) {
          default:
            $state = -3;
            break;
        }
      }
    }
  };
  var $continuation = $G.moveNext.bind($G);
  var $createCallback = function($newState) {
    return function($0) {
      $state = $newState;
      $value = $0;
      $continuation();
    };
  };
  var $createErrback = function($newState) {
    return function($0) {
      $state = $newState;
      $err = $0;
      $continuation();
    };
  };
  $continuation();
  return $result.createPromise();
}
function exec(seed) {
  var result = Predictor.predict(env, new PRNG(seed));
  console.log(result);
  document.querySelector("#result").innerHTML = ("\n\t\t結果: " + result.length + " 件\n\t\t<table>\n\t\t<tr><td></td>" + Util.iota(env.nBattles).map((function(i) {
    return ("<td>" + (i + 1) + "戦目</td>");
  })).join("") + "</tr>\n\t\t" + result.map((function(r, i) {
    return ("<tr>\n\t\t\t\t<td>" + i + "件目</td>\n\t\t\t\t" + r.enemies.map((function(enemy) {
      return ("<td>" + enemy.map((function(x) {
        return x.pokemon;
      })).join(",") + "</td>");
    })).join("") + "\n\t\t\t\t</tr>");
  })).join("") + "</table>\n\t");
}
window.addEventListener("load", (function() {
  main().then((function() {
    return console.log("done");
  }), (function(e) {
    return console.log(e);
  }));
}));
