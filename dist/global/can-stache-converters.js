/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-stache-converters@3.0.1#can-stache-converters*/
define('can-stache-converters', function (require, exports, module) {
    var stache = require('can-stache');
    var stringToAny = require('can-util/js/string-to-any/string-to-any');
    require('can-stache-bindings');
    stache.registerConverter('boolean-to-inList', {
        get: function (item, list) {
            if (!list) {
                return false;
            } else {
                return list.indexOf(item) !== -1;
            }
        },
        set: function (newVal, item, list) {
            if (!list) {
                return;
            }
            if (!newVal) {
                var idx = list.indexOf(item);
                if (idx !== -1) {
                    list.splice(idx, 1);
                }
            } else {
                list.push(item);
            }
        }
    });
    stache.registerConverter('string-to-any', {
        get: function (compute) {
            return '' + compute();
        },
        set: function (newVal, compute) {
            var converted = stringToAny(newVal);
            compute(converted);
        }
    });
    stache.registerConverter('not', {
        get: function (compute) {
            return !compute();
        },
        set: function (newVal, compute) {
            compute(!newVal);
        }
    });
    stache.registerConverter('index-to-selected', {
        get: function (item, list) {
            var val = item.isComputed ? item() : item;
            var idx = list.indexOf(val);
            return idx;
        },
        set: function (idx, item, list) {
            var newVal = list[idx];
            if (newVal !== -1 && item.isComputed) {
                item(newVal);
            }
        }
    });
    stache.registerConverter('either-or', {
        get: function (chosen, a, b) {
            return b !== chosen();
        },
        set: function (newVal, chosen, a, b) {
            chosen(newVal ? a : b);
        }
    });
    stache.registerConverter('equal', {
        get: function (compute, comparer) {
            var val = compute && compute.isComputed ? compute() : compute;
            return val === comparer;
        },
        set: function (b, compute, comparer) {
            if (b) {
                compute(comparer);
            }
        }
    });
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();