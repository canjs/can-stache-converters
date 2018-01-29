require("can-stache-converters");
var compute = require("can-compute");
var domEvents = require("can-dom-events");
var stache = require("can-stache");

var QUnit = require("steal-qunit");

QUnit.module("can-stache-converters: equal");

QUnit.test("Basics works", function(){
	var template = stache('<input type="radio" checked:bind="equal(~attending, \'yes\'" /><input type="radio" checked:bind="equal(~attending, \'no\'" />');
	var attending = compute("yes");

	var yes = template({ attending: attending }).firstChild,
		no = yes.nextSibling;

	QUnit.equal(yes.checked, true, "initially a yes");
	QUnit.equal(no.checked, false, "initially unchecked");

	attending("no");

	QUnit.equal(yes.checked, false, "now not checked");
	QUnit.equal(no.checked, true, "now checked");

	// User changing stuff
	yes.checked = true;
	domEvents.dispatch(yes, "change");

	QUnit.equal(attending(), "yes", "now it is yes");
	QUnit.equal(yes.checked, true, "yes is checked");
	QUnit.equal(no.checked, false, "no is unchecked");
});

QUnit.test("works without ~", function(){
	var template = stache('<input type="radio" checked:bind="equal(attending, \'yes\'" /><input type="radio" checked:bind="equal(~attending, \'no\'" />');
	var attending = compute("yes");

	var yes = template({ attending: attending }).firstChild,
		no = yes.nextSibling;

	QUnit.equal(yes.checked, true, "initially a yes");
	QUnit.equal(no.checked, false, "initially unchecked");

	attending("no");

	QUnit.equal(yes.checked, false, "now not checked");
	QUnit.equal(no.checked, true, "now checked");

	// User changing stuff
	yes.checked = true;
	domEvents.dispatch(yes, "change");

	QUnit.equal(attending(), "yes", "now it is yes");
	QUnit.equal(yes.checked, true, "yes is checked");
	QUnit.equal(no.checked, false, "no is unchecked");
});

QUnit.test("Allows one-way binding when passed a non-compute as the first argument", function(){
	var template = stache('<input type="radio" checked:bind="equal(attending, true)" />');
	var attending = compute(false);

	var input = template({ attending: attending }).firstChild;

	QUnit.equal(input.checked, false, 'initially false');

	attending(true);

	QUnit.equal(input.checked, true, 'can be changed to true');

	input.checked = false;

	QUnit.equal(attending(), true, 'does not change compute');
});

QUnit.test("Allow multiple expressions to be passed in", function() {
	var template = stache('<input type="radio" checked:bind="equal(~foo, ~bar, true)" />');
	var foo = compute(true);
	var bar = compute(false);

	var input = template({
		foo: foo,
		bar: bar
	}).firstChild;

	QUnit.equal(input.checked, false, 'initially unchecked');

	bar(true);

	QUnit.equal(input.checked, true, 'now checked');

	foo(false);
	bar(false);

	QUnit.equal(input.checked, false, 'now unchecked');

	input.checked = true;
	domEvents.dispatch(input, "change");

	QUnit.equal(foo(), true, 'computed foo value is true');
	QUnit.equal(bar(), true, 'computed bar value is true');
});

QUnit.test("Allow multiple expressions to be passed in without ~", function() {
	var template = stache('<input type="radio" checked:bind="equal(foo, bar, true)" />');
	var foo = compute(true);
	var bar = compute(false);

	var input = template({
		foo: foo,
		bar: bar
	}).firstChild;

	QUnit.equal(input.checked, false, 'initially unchecked');

	bar(true);

	QUnit.equal(input.checked, true, 'now checked');

	foo(false);
	bar(false);

	QUnit.equal(input.checked, false, 'now unchecked');

	input.checked = true;
	domEvents.dispatch(input, "change");

	QUnit.equal(foo(), true, 'computed foo value is true');
	QUnit.equal(bar(), true, 'computed bar value is true');
});
