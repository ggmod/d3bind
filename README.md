D3bind
======

D3bind is a library that brings model-view separation and observables to d3.js.

Examples can be found here: [code](https://github.com/ggmod/d3bind-demo), [demo](https://ggmod.github.io/d3bind-demo)

Hello world example:

```javascript
var model = d3bind.observable({ name: '' });
var parent = d3bind.select('body');

parent.append('input').attr('type', 'text').bindInput(model.$name);
parent.append('div')
    .bindStyle('display', model.$name, function(name) { return name ? 'block' : 'none'; })
    .bindText(model.$name, function(name) { return 'Hello ' + name; });
```

To debug the cascading changes of observables, switch on logging:
```javascript
d3bind.logging = true;
```

Released under The MIT License.
