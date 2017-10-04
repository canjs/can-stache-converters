require("can-stache-converters");
var canEvent = require("can-event");
var DefineList = require("can-define/list/list");
var DefineMap = require("can-define/map/map");
var stache = require("can-stache");
var each = require("can-util/js/each/each");

var QUnit = require("steal-qunit");

QUnit.module("selected-to-index");

QUnit.test("sets index by the value from a list", function(){
	var template = stache('<input value:bind="selected-to-index(~index, people)" />');

	var map = new DefineMap({
		index: "1",
		people: [
			"Matthew",
			"Anne",
			"Wilbur"
		]
	});

	var input = template(map).firstChild;

	// Initial value
	QUnit.equal(input.value, "Anne", "initially set to the first value");

	// Select a different thing.
	input.value = "Wilbur";
	canEvent.trigger.call(input, "change");

	QUnit.equal(map.index, "2", "now it is me");

	// Change the selected the other way.
	map.index = "0";

	QUnit.equal(input.value, "Matthew", "set back");

	// Can be set to other stuff too
	input.value = "none";
	canEvent.trigger.call(input, "change");

	QUnit.equal(map.index, -1, "now -1 because not in the list");
});
