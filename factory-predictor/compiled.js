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
var $__9;
Object.defineProperty(Array.prototype, "flatten", {
  value: function() {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
      ($__9 = ret).push.apply($__9, $__toObject(traceur.runtime.elementGet(this, i)));
    }
    return ret;
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "include", {
  value: function(x) {
    return this.indexOf(x) >= 0;
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "clone", {
  value: function() {
    return this.slice(0);
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "count", {
  value: function(predicate) {
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
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "diff", {
  value: function(other) {
    return this.filter((function(x) {
      return !other.include(x);
    }));
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "cap", {
  value: function(other) {
    return this.filter((function(x) {
      return other.include(x);
    }));
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "sortBy", {
  value: function(func) {
    var keys = this.map(func);
    return Util.iota(this.length).sort((function(a, b) {
      return traceur.runtime.elementGet(keys, a) - traceur.runtime.elementGet(keys, b);
    })).map((function(i) {
      return traceur.runtime.elementGet(this, i);
    }).bind(this));
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "minBy", {
  value: function(keyOf) {
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
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "maxBy", {
  value: function(keyOf) {
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
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "max", {
  value: function() {
    return this.maxBy((function(x) {
      return x;
    }));
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "findIndex", {
  value: function(func) {
    for (var i = 0; i < this.length; i++) {
      if (func(traceur.runtime.elementGet(this, i))) return i;
    }
    return null;
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "find", {
  value: function(func) {
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
  },
  configurable: true,
  enumerable: false,
  writable: true
});
Object.defineProperty(Array.prototype, "last", {
  get: function() {
    return traceur.runtime.elementGet(this, this.length - 1);
  },
  enumerable: false
});
Object.defineProperty(Array.prototype, "isEmpty", {
  get: function() {
    return this.length == 0;
  },
  enumerable: false
});
var Util = function() {
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
    }
  });
  return $Util;
}();
var PRNG = function() {
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
      try {
        throw undefined;
      } catch (B) {
        try {
          throw undefined;
        } catch (A) {
          {
            A = 0x41c64e6d;
            B = 0x6073;
          }
          this.seed = (this._mul(this.seed, A) + B) >>> 0;
        }
      }
    },
    dup: function() {
      return new PRNG(this.seed);
    },
    _mul: function(a, b) {
      try {
        throw undefined;
      } catch (b2) {
        try {
          throw undefined;
        } catch (b1) {
          try {
            throw undefined;
          } catch (a2) {
            try {
              throw undefined;
            } catch (a1) {
              {
                a1 = a >>> 16;
                a2 = a & 0xffff;
              }
              {
                b1 = b >>> 16;
                b2 = b & 0xffff;
              }
              return (((a1 * b2 + a2 * b1) << 16) + a2 * b2) >>> 0;
            }
          }
        }
      }
    }
  }, {});
  return $PRNG;
}();
var Entry = function() {
  'use strict';
  var $Entry = ($__createClassNoExtends)({
    constructor: function(id, item, pokemon) {
      this.id = id;
      this.item = item;
      this.pokemon = pokemon;
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
var Env = function() {
  'use strict';
  var $Env = ($__createClassNoExtends)({constructor: function(options) {
      this.nParty = options.nParty;
      this.nStarters = options.nStarters;
      this.nBattles = options.nBattles;
      this.allEntries = options.allEntries;
    }}, {});
  return $Env;
}();
var FactoryHelper = function() {
  'use strict';
  var $FactoryHelper = ($__createClassNoExtends)({constructor: function() {}}, {
    parseAllEntries: function(csvString) {
      return Util.split(csvString, "\n").map((function(line, i) {
        try {
          throw undefined;
        } catch (item) {
          try {
            throw undefined;
          } catch (pokemon) {
            try {
              throw undefined;
            } catch ($__8) {
              {
                $__8 = line.split(",");
                pokemon = traceur.runtime.elementGet($__8, 0);
                item = traceur.runtime.elementGet($__8, 1);
              }
              return new Entry(i + 1, item, pokemon);
            }
          }
        }
      }));
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
      } catch (i) {
        i = prng.randQ(env.allEntries.length);
        return traceur.runtime.elementGet(env.allEntries, i);
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
    }
  });
  return $FactoryHelper;
}();
var RoughPredictor = function() {
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
          } catch ($__8) {
            {
              $__8 = FactoryHelper.choose_entries(this.env, prng, this.env.nStarters);
              prngp = traceur.runtime.elementGet($__8, 0);
              starters = traceur.runtime.elementGet($__8, 1);
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
              return this.predict0(result.prng, $__spread(enemies, [result.chosen]), $__spread(skipped, [result.skipped]), starters);
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
var RoughPredictorResult = function() {
  'use strict';
  var $RoughPredictorResult = ($__createClassNoExtends)({constructor: function(prng, enemies, skipped, starters) {
      this.prng = prng;
      this.enemies = enemies;
      this.skipped = skipped;
      this.starters = starters;
    }}, {});
  return $RoughPredictorResult;
}();
var OneEnemyPredictor = function() {
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
          } catch ($__8) {
            if (chosen.length == this.env.nParty) {
              return [new OneEnemyPredictorResult(prng, chosen, skipped)];
            }
            {
              $__8 = FactoryHelper.choose_entry(this.env, prng);
              prngp = traceur.runtime.elementGet($__8, 0);
              x = traceur.runtime.elementGet($__8, 1);
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
var OneEnemyPredictorResult = function() {
  'use strict';
  var $OneEnemyPredictorResult = ($__createClassNoExtends)({constructor: function(prng, chosen, skipped) {
      this.prng = prng;
      this.chosen = chosen;
      this.skipped = skipped;
    }}, {});
  return $OneEnemyPredictorResult;
}();
var Predictor = function() {
  'use strict';
  var $Predictor = ($__createClassNoExtends)({constructor: function() {}}, {predict: function(env, prng) {
      return RoughPredictor.predict(env, prng).filter((function(r) {
        return Judge.judge(env, r);
      }));
    }});
  return $Predictor;
}();
var Judge = function() {
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
          var $__6 = traceur.runtime.getIterator(Util.range(2, this.env.nBattles));
          try {
            while (true) {
              try {
                throw undefined;
              } catch (i) {
                i = $__6.next();
                {
                  {
                    var $__5 = traceur.runtime.getIterator(traceur.runtime.elementGet(this.gate, i));
                    try {
                      while (true) {
                        try {
                          throw undefined;
                        } catch (item) {
                          item = $__5.next();
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
          var $__7 = traceur.runtime.getIterator(Util.range(2, this.env.nBattles));
          try {
            while (true) {
              try {
                throw undefined;
              } catch (i) {
                i = $__7.next();
                {
                  try {
                    throw undefined;
                  } catch (sh) {
                    sh = traceur.runtime.elementGet(this.shop, i - 2);
                    if (i == 2) {
                      try {
                        throw undefined;
                      } catch (items) {
                        items = schedule.filter((function(w) {
                          return w.head == i;
                        })).map((function(w) {
                          return w.item;
                        }));
                        player = $__spread(items, (sh.diff(items).sortBy((function(item) {
                          return - this.caught(item, i);
                        }).bind(this)))).slice(0, this.env.nParty);
                      }
                    } else {
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
                                player = $__spread(player.diff([a]), [work.item]);
                              } else {
                                try {
                                  throw undefined;
                                } catch (b) {
                                  b = sh.maxBy((function(item) {
                                    return this.caught(item, i);
                                  }).bind(this));
                                  if (this.caught(a, i) < this.caught(b, i)) {
                                    player = $__spread(player.diff([a]), [b]);
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    if (!(player.cap(traceur.runtime.elementGet(this.shop, i)).isEmpty)) {
                      return false;
                    }
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
var Work = function() {
  'use strict';
  var $Work = ($__createClassNoExtends)({constructor: function(item, head, tail) {
      this.item = item;
      this.head = head;
      this.tail = tail;
      this.range = Util.range(head, tail);
    }}, {});
  return $Work;
}();
var Assigner = function() {
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
          document.body.innerHTML = "\n\t\t<h1>factory-predictor</h1>\n\t\t<form action=\"\" onsubmit=\"return false\">\n\t\tseed: <input type=\"text\" id=\"seed\" value=\"0\">\n\t\t<input type=\"submit\" value=\"実行\">\n\t\t</form>\n\t\t<div id=\"result\"></div>\n\t";
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
