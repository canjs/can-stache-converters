@module can-stache-converters
@parent can-ecosystem
@group can-stache-converters.examples Examples
@group can-stache-converters.converters Converters
@package ../package.json

Provides a set of [can-stache.registerConverter converters] useful for two-way binding with form elements such as `<input>` and `<select>`.

@body

## Use

The **can-stache-converters** plugin provides a set of useful converters useful for binding to form elements.

Add a binding with a converter to an input or select element and
the element's value will be cross-bound to an observable value specified by the binding attribute's value.

Depending on the element and the element's type, different behaviors to properly synchronize view model data
and element attributes.

## input type=text

`{($value)}="key"` cross-binds the input's string text value with the observable value.

The value of the observable is changed after the input's `change` event,
which is after `blur`.

## input type=checkbox

`{($checked)}="key"` cross-binds the checked property to a true or false value.

`{($checked)}="boolean-to-inList(~key, list)"` cross-binds the checked property to `key` being added to / removed from `list`.  The tilde (`~`) is important here because the compute it sets up acts as a channel between the element's property and the scope's property.

`{($checked)}="either-or(~key, checkedval, uncheckedval)"` cross-binds the checked property to `key`, but uses the `checkedval`
value to represent checked, and the `uncheckedval` value to represent unchecked.

## input type='radio'

`{($checked)}="key"` cross-binds the checked property to `key` being true or false.

`{($checked)}="equal(~key, value)"` cross-binds the checked property to `key` having a value equal to `value`. This is useful for radio groups representing options for a single data property.

## select

`{($value)}="key"` cross-binds the selected option value with an observable value.

For multiple-selection lists, `{($values)}="key"` cross-binds selected options with membership in `key`, with the requirement that `key` on the scope is an array-like or a string.  If `key` is a string, it is treated as a comma-separated list of values.

## textarea

`{($value)}="key"` cross-binds the textarea's string text value with the observable value.

The value of the observable is changed after the textarea's `change` event,
which is after `blur`.

> There is a way of making changes respond to key events as well: `($keyup)="%scope.set('key', %element.value)`.  However, this  sets the value of `key` at the current scope level.  If `key` was set at a higher level of the scope, the cross binding of `{($value)}` will not point to the same item as the keyup target.

