require("can-stache-converters");
var DefineList = require("can-define/list/list");
var DefineMap = require("can-define/map/map");
var domEvents = require("can-dom-events");
var stache = require("can-stache");

var QUnit = require("steal-qunit");

QUnit.module("not");

QUnit.test("saves the inverse of the selected value without ~ (#68)", function(){
	var template = stache('<input type="checkbox" checked:bind="not(val)" />');
	var map = new DefineMap({
		val: true
	});

	var input = template(map).firstChild;

	QUnit.equal(input.checked, false, "initially false");

	map.val = false;

	QUnit.equal(input.checked, true, "true because map val is false");

	input.checked = false;
	domEvents.dispatch(input, "change");

	QUnit.equal(map.val, true, "map is now true because checkbox is false");
});


QUnit.test("saves the inverse of the selected value", function(){
	var template = stache('<input type="checkbox" checked:bind="not(~val)" />');
	var map = new DefineMap({
		val: true
	});

	var input = template(map).firstChild;

	QUnit.equal(input.checked, false, "initially false");

	map.val = false;

	QUnit.equal(input.checked, true, "true because map val is false");

	input.checked = false;
	domEvents.dispatch(input, "change");

	QUnit.equal(map.val, true, "map is now true because checkbox is false");
});

QUnit.test("works with boolean-to-inList", function(){
	var template = stache("<input type='checkbox' checked:bind='not(~boolean-to-inList(item, list))' />");
	var map = new DefineMap({
		item: 2,
		list: new DefineList([ 1, 2, 3 ])
	});

	var input = template(map).firstChild;

	QUnit.equal(input.checked, false, "not checked because it is in the list");

	map.item = 4;

	QUnit.equal(input.checked, true, "checked because not in the list");

	input.checked = false;
	domEvents.dispatch(input, "change");

	QUnit.equal(map.list.indexOf(4), 3, "it was pushed into the list");

	// Remove it from the list
	map.list.splice(3, 1);
	QUnit.equal(input.checked, true, "now it's checked because not in the list");
});
