D3bind
======

D3bind is a library that brings model-view separation and observables to <b>d3.js</b>.

You can use the bundled library: [d3bind.js](https://github.com/ggmod/d3bind/releases/download/v0.1.1/d3bind.js), or install it with `npm install d3bind --save`

Examples can be found here: [code](https://github.com/ggmod/d3bind-demo), [demo](https://ggmod.github.io/d3bind-demo)

[See the wiki](https://github.com/ggmod/d3bind/wiki) for more explanation.

#### Hello world example:

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

#### Licensing
Released under The MIT License.
