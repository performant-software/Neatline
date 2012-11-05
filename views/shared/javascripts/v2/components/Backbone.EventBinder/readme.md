# Backbone.EventBinder

Manage your Backbone events better.

## About Backbone.EventBinder

Backbone's events are a great way to decouple parts of your system, but 
they have some limitations and behaviors that you need to be aware of
which can cause 
[zombie objects and memory leaks](http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/) 
if you're not careful.

Backbone.EventBinder provides a simple mechanism for cleaning up your
event bindings, including the ability to clean up anonymous callback
functions!

## Downloads And Source

Grab the source from the `src` folder above. Grab the most recent builds
from the links below.

### Standard Builds

* Development: [backbone.eventbinder.js](https://raw.github.com/marionettejs/backbone.eventbinder/master/lib/backbone.eventbinder.js)

* Production: [backbone.eventbinder.min.js](https://raw.github.com/marionettejs/backbone.eventbinder/master/lib/backbone.eventbinder.min.js)

### RequireJS (AMD) Builds

* Development: [backbone.eventbinder.js](https://raw.github.com/marionettejs/backbone.eventbinder/master/lib/amd/backbone.eventbinder.js)

* Production: [backbone.eventbinder.min.js](https://raw.github.com/marionettejs/backbone.eventbinder/master/lib/amd/backbone.eventbinder.min.js)

## Documentation

The `EventBinder` object provides event binding management for related
events, across any number of objects that trigger the events. This allows
events to be grouped together and unbound with a single call during the 
clean-up of an object that is bound to the events.

Ultimately, the EventBinder calls back to the standard Backbone `on` method
of the object for which events are being handled. The benefit of using the
EventBinder then, is that you no longer have to manually manage calling `off`
for each of these events, and you can safely use anonymous callback functions
as event arguments and stil be able to unbind them when needed.

### Bind Events

The basic syntax for binding events is to use the `bindTo` method which 
follows the path of Backbone's `on` method for events, but adds one parameter 
to the beginning of the method call: the object that triggers the event.

For example, if you have a model that you want to listen for events from,
you can use the EventBinder to manage the event for you:

```js
var binder = new Backbone.EventBinder();

var model = new MyModel();

var handler = {
  doIt: function(){ /* ... */ }
}

// same args list as model.on, but putting the model as the first parameter
binder.bindTo(model, "change:foo", handler.doIt, handler);
```

You can specify a 4th parameter as the context in which the callback
method for the event will be executed. If you leave the empty, the default
context will be used (varies depending on other circumstances) just like
Backbone's events. 

```js
binder.bindTo(model, "change:foo", someCallback, someContext);
```

### Unbind A Single Event

When you call `bindTo`, it returns a "binding" object that can be
used to unbind from a single event with the `unbindFrom` method:

```js
var binding = binder.bindTo(model, "change:foo", someCallback, someContext);

// later in the code
binder.unbindFrom(binding);
```

This will unbind the event that was configured with the binding
object, and remove it from the EventBinder bindings.

### Unbind All Events

You can call `unbindAll` to unbind all events that were bound with the
`bindTo` method:

```js
binder.unbindAll();
```

This even works with in-line callback functions.

### When To Use EventBinder vs `on` Handlers

See the wiki: [When to use the EventBinder](https://github.com/marionettejs/backbone.eventbinder/wiki/When-to-use-the-EventBinder)

## Release History

 - v1.0.0 No changes, promoted stable code to 1.0 status
 - v0.1.0 Added support for jQuery style objects
 - v0.0.0 initial release, pulled from Marionette

## License

MIT - see [LICENSE.md](https://raw.github.com/marionettejs/backbone.eventbinder/master/LICENSE.md)
