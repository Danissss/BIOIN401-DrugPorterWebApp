# Overlay

Really stupidly simple overlay for browser.
Depends on jQuery, uses [q](library), instance of [EventEmitter](http://nodejs.org/api/events.html).

## Abandoned

Unfortunately I don't have any more time to maintain this repository :-(

![sad cat](https://raw.githubusercontent.com/sakren/sakren.github.io/master/images/sad-kitten.jpg)

## Usage

```
var Overlay = require('overlay');

Overlay.show().then(function() {
	console.log('I have just been opened');
});

Overlay.hide().then(function() {
	console.log('I have just been closed');
});
```

## Options

There are few options for styling this overlay.

* color [black]: fill overlay with color
* opacity [0.8]
* zIndex [1000]
* duration [fast]: animation speed for jquery animation
* scrollable [false]: if this is true and overlay shows up, then window scroll bar disappear.

```
var options = {
	color: 'red'
};

Overlay.show(options);
```

## Events

Overlay has got these events:

* show: fired after show method is called
* shown: fired after show animation finished
* hide: fired after hide method is called
* hidden: fired after hide animation finished

```
Overlay.on('shown', function() {
	alert('Congratulation');
});
```

## Changelog

* 1.2.5
	+ Move under Carrooi organization
	+ Abandon package

* 1.2.4
	+ Removed forgotten debug code

* 1.2.3
	+ Added tests

* 1.2.1 - 1.2.2
	+ Bug fix

* 1.2.0
	+ Instance of EventEmitter
	+ Events moved into EventEmitter
	+ Improvements in doc
