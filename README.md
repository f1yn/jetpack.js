
# jetpack.js
[![dependencies Status](https://david-dm.org/flynnham/jetpack.js/status.svg)](https://david-dm.org/flynnham/jetpack.js)

A simple vanilla JavaScript library that makes scrolling look outrageously good.
A live demo of jetpack.js (alongside [automenu](https://github.com/flynnham/automenu)) can be found at
[flynnbuckingham.com/projects/automenu-jetpack](http://flynnbuckingham.com/projects/automenu-jetpack).

## How to use
Include either `jetpack.js` or `jetpack.min.js` to your document header, and simply add the following lines
after your document has loaded:
```javascript
var jet = new jetpack({options});
jet.hookAnchors();
```

## Options
The jetpack factory function has a single parameter, that uses the following options
```javascript
options = {
    callback: Function,  // executes a function after object is successfully initialized. This does nothing by default.
    duration: 'fast' || 'slow' || 'medium' || Number || 900, // the duration of each page animation. This is 900ms by default.
    updateURL: true || false, // [false by default] enables automatic URL updating when page animation's are finished. Enabled by default.
    animation:  true || false // [true by default] enables or disables page animation.
}
```

## Building from source
To build this project from source, install dependencies with `npm install` and run the builder with `gulp build`.
If successful, build files will populate the `dist/` directory. This module works best as being required in a bundling
software.
