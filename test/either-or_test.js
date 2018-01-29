require("can-stache-converters");
var compute = require("can-compute");
var DefineMap = require("can-define/map/map");
var domEvents = require("can-dom-events");
var stache = require("can-stache");
var QUnit = require("steal-qunit");

QUnit.module("either-or");

QUnit.test("can bind to a checkbox", function(){
	var renderer = stache("<input type='checkbox' checked:bind='either-or(~pref, \"Star Trek\", \"Star Wars\")' />");
	var map = new DefineMap({
		pref: "Star Trek"
	});

	var input = renderer(map).firstChild;

	QUnit.equal(input.checked, true, "initial value is right");

	input.checked = false;
	domEvents.dispatch(input, "change");

	QUnit.equal(map.pref, "Star Wars", "changed because input changed");

	map.pref = "Star Trek";
	QUnit.equal(input.checked, true, "changed because map changed");
});

QUnit.test("initial null selection", function() {
	var renderer = stache("<input type='checkbox' checked:bind='either-or(~pref, \"Yes\", \"No\")' />");
	var map = new DefineMap({
		pref: null
	});
	var input = renderer(map).firstChild;

	QUnit.equal(input.checked, false, "checkbox is unchecked");
	QUnit.strictEqual(map.pref, "No", "null value changed to falsey case by checkbox");

	input.checked = true;
	domEvents.dispatch(input, "change");
	QUnit.equal(map.pref, "Yes", "map updated because check was checked");
});

QUnit.test("initial undefined selection", function() {
	var renderer = stache("<input type='checkbox' checked:bind='either-or(~pref, \"Yes\", \"No\")' />");
	var map = new DefineMap({
		pref: undefined
	});
	var input = renderer(map).firstChild;

	QUnit.equal(input.checked, false, "checkbox is unchecked");
	QUnit.strictEqual(map.pref, "No", "undefined value changed to falsey case by checkbox");

	input.checked = true;
	domEvents.dispatch(input, "change");
	QUnit.equal(map.pref, "Yes", "map updated because check was checked");
});

QUnit.test("initial no match selection", function() {
	var renderer = stache("<input type='checkbox' checked:bind='either-or(~pref, \"Yes\", \"No\")' />");
	var map = new DefineMap({
		pref: "fubar"
	});
	var input = renderer(map).firstChild;

	QUnit.equal(input.checked, false, "checkbox is unchecked");
	QUnit.strictEqual(map.pref, "No", "fubar value changed to falsey case by checkbox");

	input.checked = true;
	domEvents.dispatch(input, "change");
	QUnit.equal(map.pref, "Yes", "map updated because check was checked");
});

QUnit.test("supports computes", function() {
	var renderer = stache("<input type='checkbox' checked:bind='either-or(~pref, a, b)' />");
	var map = new DefineMap({
		pref: compute("Maybe"),
		a: compute("Yes"),
		b: compute("No")
	});
	var input = renderer(map).firstChild;

	QUnit.equal(input.checked, false, "checkbox is unchecked");
	QUnit.strictEqual(map.pref(), "No", "chosen value changed to falsey case by checkbox");

	input.checked = true;
	domEvents.dispatch(input, "change");
	QUnit.equal(map.pref(), "Yes", "map updated because check was checked");

	input.checked = false;
	domEvents.dispatch(input, "change");
	QUnit.equal(map.pref(), "No", "map updated because check was unchecked");
});

QUnit.test("supports computes without ~", function() {
	var renderer = stache("<input type='checkbox' checked:bind='either-or(pref, a, b)' />");
	var map = new DefineMap({
		pref: compute("Maybe"),
		a: compute("Yes"),
		b: compute("No")
	});
	var input = renderer(map).firstChild;

	QUnit.equal(input.checked, false, "checkbox is unchecked");
	QUnit.strictEqual(map.pref(), "No", "chosen value changed to falsey case by checkbox");

	input.checked = true;
	domEvents.dispatch(input, "change");
	QUnit.equal(map.pref(), "Yes", "map updated because check was checked");

	input.checked = false;
	domEvents.dispatch(input, "change");
	QUnit.equal(map.pref(), "No", "map updated because check was unchecked");
});
