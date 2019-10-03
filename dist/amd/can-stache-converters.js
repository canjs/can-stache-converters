/*can-stache-converters@5.0.0-pre.1#can-stache-converters*/
define([
    'require',
    'exports',
    'module',
    'can-reflect',
    'can-stache',
    'can-string-to-any',
    'can-log/dev',
    'can-stache-bindings',
    'can-stache-helpers'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    var stache = require('can-stache');
    var stringToAny = require('can-string-to-any');
    var dev = require('can-log/dev');
    var stacheBindings = require('can-stache-bindings');
    var stacheHelpers = require('can-stache-helpers');
    stache.addBindings(stacheBindings);
    var shouldPop = false;
    stache('{{echo(args(1))}}')({
        echo: function () {
        },
        args: function () {
            shouldPop = arguments.length > 1;
        }
    });
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
    var converters = {
        'string-to-any': {
            get: function (obs) {
                return '' + canReflect.getValue(obs);
            },
            set: function (newVal, obs) {
                var converted = stringToAny(newVal);
                canReflect.setValue(obs, converted);
            }
        },
        'index-to-selected': {
            get: function (item, list) {
                var val = canReflect.getValue(item);
                var idx = canReflect.getValue(list).indexOf(val);
                return idx;
            },
            set: function (idx, item, list) {
                var newVal = canReflect.getValue(list)[idx];
                canReflect.setValue(item, newVal);
            }
        },
        'selected-to-index': {
            get: function (idx, list) {
                var val = canReflect.getValue(idx), listValue = canReflect.getValue(list);
                var item = listValue[val];
                return item;
            },
            set: function (item, idx, list) {
                var newVal = canReflect.getValue(list).indexOf(item);
                canReflect.setValue(idx, newVal);
            }
        },
        'either-or': {
            get: function (chosen, a, b) {
                var chosenVal = canReflect.getValue(chosen), aValue = canReflect.getValue(a), bValue = canReflect.getValue(b);
                var matchA = aValue === chosenVal;
                var matchB = bValue === chosenVal;
                if (!matchA && !matchB) {
                    return;
                } else {
                    return matchA;
                }
            },
            set: function (newVal, chosen, a, b) {
                var setVal = newVal ? canReflect.getValue(a) : canReflect.getValue(b);
                canReflect.setValue(chosen, setVal);
            }
        },
        'equal': {
            get: function () {
                var args = canReflect.toArray(arguments);
                if (shouldPop) {
                    args.pop();
                }
                if (args.length > 1) {
                    var comparer = canReflect.getValue(args.pop());
                    return args.every(function (obs) {
                        var value = canReflect.getValue(obs);
                        return value === comparer;
                    });
                }
            },
            set: function () {
                var args = canReflect.toArray(arguments);
                if (shouldPop) {
                    args.pop();
                }
                if (args.length > 2) {
                    var b = args.shift();
                    var comparer = canReflect.getValue(args.pop());
                    if (b) {
                        for (var i = 0; i < args.length; i++) {
                            canReflect.setValue(args[i], comparer);
                        }
                    }
                }
            }
        }
    };
    stache.addConverter(converters);
    if (!stacheHelpers.not) {
        stache.addConverter('not', {
            get: function (obs) {
                return !canReflect.getValue(obs);
            },
            set: function (newVal, obs) {
                canReflect.setValue(obs, !newVal);
            }
        });
    }
    module.exports = converters;
});