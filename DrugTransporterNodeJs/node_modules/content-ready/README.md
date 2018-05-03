# content-ready

Listen for moment when content of element is ready (even with all images).

Depends on jquery, uses [q](https://npmjs.org/package/q) promise library.

This library is useful when you need to know when for example all images in some element are loaded.

## Abandoned

Unfortunately I don't have any more time to maintain this repository :-(

![sad cat](https://raw.githubusercontent.com/sakren/sakren.github.io/master/images/sad-kitten.jpg)

## Installation

```
$ npm install content-ready
```

## Usage

```
var ready = require('content-ready');

ready($('#someRandomElement')).then(function(el) {
	console.log('all images were loaded.');
});
```

## Changelog

* 1.0.1
	+ Move under Carrooi organization
	+ Abandon package

* 1.0.0
	+ First version
