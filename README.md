
# jetpack.js
A simple vanilla JavaScript library that makes scrolling look outrageously good.
A live demo of jetpack.js (alongside [automenu](https://github.com/flynnham/automenu)) can be found at
[flynnbuckingham.com/projects/automenu-jetpack](http://flynnbuckingham.com/projects/automenu-jetpack).


## How to use
Include either `jetpack.js` or `jetpack.min.js` to your document header, and simply add the following lines
after your document has loaded:
```javascript
var jetpack = new jetPack({options});
jetpack.hookAnchors();
```

## Options

Jetpack.js has the following options:
```javascript
{
    callback: {function} || {default: does nothing},  // executes a function after object is successfully initialized. This does nothing by default.
    duration: {string: 'fast', 'slow', 'medium', '(Number)'} || {Number} || {default: 900}, // the duration of each page animation. This is 900ms by default.
    updateURL: {boolean} || {default: true}, // enabled automatic URL updating when page animation's are finished. Enabled by default.
    animate: {boolean} || {default: true} // enabled or disables page animation.
}
```

## Building from source

To build this project from source, install dependencies with `npm install` and run the builder with `gulp build`.
If successful, build files will populate the `dist/` directory.