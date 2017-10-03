var stache = require("can-stache");
var stringToAny = require("can-util/js/string-to-any/string-to-any");
var makeArray = require("can-util/js/make-array/make-array");
var dev = require("can-util/js/dev/dev");
require("can-stache-bindings");

stache.registerConverter("boolean-to-inList", {
	get: function(item, list){
		if(!list) {
			return false;
		} else {
			return list.indexOf(item) !== -1;
		}
	},
	set: function(newVal, item, list){
		if(!list) {
			return;
		}
		if(!newVal) {
			var idx = list.indexOf(item);
			if(idx !== -1) {
				list.splice(idx, 1);
			}
		} else {
			list.push(item);
		}
	}
});

stache.registerConverter("string-to-any", {
	get: function(compute){
		return "" + compute();
	},
	set: function(newVal, compute){
		var converted = stringToAny(newVal);
		compute(converted);
	}
});

stache.registerConverter("not", {
	get: function(compute){
		return !compute();
	},
	set: function(newVal, compute){
		compute(!newVal);
	}
});

stache.registerConverter("index-to-selected", {
	get: function(item, list){
		var val = item.isComputed ? item() : item;
		var idx = list.indexOf(val);
		return idx;
	},
	set: function(idx, item, list){
		var newVal = list[idx];
		if(item.isComputed) {
			item(newVal);
		}
	}
});

stache.registerConverter("selected-to-index", {
	get: function(idx, list){
		var val = idx.isComputed ? idx() : idx;
		var item = list[val];
		return item;
	},
	set: function(item, idx, list){
		var newVal = list.indexOf(item);
		if(idx.isComputed) {
			idx(newVal);
		}
	}
});

stache.registerConverter("either-or", {
	get: function(chosen, a, b){
		var matchA = (a === chosen());
		var matchB = (b === chosen());

		if (!matchA && !matchB) {
			//!steal-remove-start
			dev.warn(
				"can-stache-converter.either-or:",
				"`" + chosen() + "`",
				"does not match `" + a + "`",
				"or `" + b + "`"
			);
			//!steal-remove-end

			return;
		}
		else {
			return matchA;
		}
	},
	set: function(newVal, chosen, a, b){
		chosen(newVal ? a : b);
	}
});

stache.registerConverter("equal", {
	get: function(){
		var args = makeArray(arguments);
		if (args.length > 1) {
			var comparer = args.pop();

			return args.every(function(compute) {
				return (compute && compute.isComputed ? compute() : compute) === comparer;
			});
		}
	},
	set: function(){
		var args = makeArray(arguments);
		if (args.length > 2) {
			var b = args.shift();
			var comparer = args.pop();
			if(b) {
				for(var i = 0; i < args.length; i++) {
					args[i](comparer);
				}
			}
		}
	}
});
