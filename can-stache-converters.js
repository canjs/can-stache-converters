var canReflect = require("can-reflect");
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
	get: function(obs){
		return "" + canReflect.getValue(obs);
	},
	set: function(newVal, obs){
		var converted = stringToAny(newVal);
		canReflect.setValue(obs, converted);
	}
});

stache.registerConverter("not", {
	get: function(obs){
		return !canReflect.getValue(obs);
	},
	set: function(newVal, obs){
		canReflect.setValue(obs, !newVal);
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
		var val = canReflect.getValue(idx);
		var item = list[val];
		return item;
	},
	set: function(item, idx, list){
		var newVal = list.indexOf(item);
		canReflect.setValue(idx, newVal);
	}
});

stache.registerConverter("either-or", {
	get: function(chosen, a, b){
		var chosenVal = canReflect.getValue(chosen);
		var matchA = (a === chosenVal);
		var matchB = (b === chosenVal);

		if (!matchA && !matchB) {
			//!steal-remove-start
			dev.warn(
				"can-stache-converter.either-or:",
				"`" + chosenVal + "`",
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
		var setVal = newVal ? a : b;
		canReflect.setValue(chosen, setVal);
	}
});

stache.registerConverter("equal", {
	get: function(){
		var args = makeArray(arguments);
		// We don't need the helperOptions
		args.pop();
		if (args.length > 1) {
			var comparer = args.pop();

			return args.every(function(obs) {
				var value = canReflect.getValue(obs);
				return value === comparer;
			});
		}
	},
	set: function(){
		var args = makeArray(arguments);
		// Ignore the helperOptions
		args.pop();
		if (args.length > 2) {
			var b = args.shift();
			var comparer = args.pop();
			if(b) {
				for(var i = 0; i < args.length; i++) {
					canReflect.setValue(args[i], comparer);
				}
			}
		}
	}
});
