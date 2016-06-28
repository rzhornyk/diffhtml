# <div style="background-color: #FFF; display: inline-block; padding: 10px 0px; color: #333;"><±/> diffHTML</div>

*A powerful JavaScript library for building user interfaces.*

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)
[![Coverage
Status](https://coveralls.io/repos/tbranyen/diffhtml/badge.svg?branch=master&service=github)](https://coveralls.io/github/tbranyen/diffhtml?branch=master) 
[![Join the chat at https://gitter.im/tbranyen/diffhtml](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/tbranyen/diffhtml)

Stable version: 1.0.0

Inspired by React and motivated by the Web, this library is designed to help
web developers write components and applications for the web. By focusing on
the markup representing how your state should look, diffHTML will figure out
how to modify the page with a minimal amount of operations.

## Quick Jump

- [Features](#features)
  - [File size](#file-size)
  - [Browser compatibility](#browser-compatibility)
- [How to install](#how-to-install)
  - [Module format locations](#module-format-locations)
- [Quick start](#quick-start)
  - [Writing a component](#writing-a-component)
  - [Composing an application](#composing-an-application)
  - [Build optimizations](#build-optimizations)
- [Documentation](#documentation)
  - [Lifecycle overview](#lifecycle-overview)
  - [Virtual Tree Abstraction](#virtual-tree-abstraction)
  - [Write & Consume Middleware](#middleware)
  - [Coming from React](#coming-from-react)
- [API](#API)
  - **[html\`tagged template helper\`](#user-content-html)**
  - [createElement(nodeName, attributes, children)](#user-content-create-element)
  - [createAttribute(name, value)](#user-content-create-attribute)
  - **[outerHTML(element, markup, options)](#user-content-diff-an-element-with-markup)**
  - **[innerHTML(element, markup, options)](#user-content-diff-an-elements-children-with-markup)**
  - [element(oldElement, newElement, options)](#user-content-diff-an-element-to-another-element)
  - [release(element)](#user-content-release-element)
  - [addTransitionState(name, callback)](#user-content-add-a-transition-state-callback)
  - [removeTransitionState(name, callback)](#user-content-remove-a-transition-state-callback)
  - [use(middleware)](#use)
- [Middleware](#middleware)
  - [Logger](https://github.com/tbranyen/diffhtml-logger) <span style="color: #CCC;">| *Useful for debugging render transactions.*</span>
  - [HTML Components](https://github.com/tbranyen/diffhtml-components) <span style="color: #CCC;">| *Helps transition from React*</span>
  - [Inline Transition Hooks](https://github.com/tbranyen/diffhtml-inline-hooks) <span style="color: #CCC;">| *Bind transition hooks declaratively in your tagged templates.*</span>
  - [Web Worker](https://github.com/tbranyen/diffhtml-worker) <span style="color: #CCC;">| *Diffing is done on a worker thread instead.*</span>
  - [Hot Module Replacement](https://github.com/tbranyen/diffhtml-hmr)  <span style="color: #CCC;">| *Automatically reload HTML Components without a page reload with browserify and webpack.*</span>
  - [renderComplete Event](https://github.com/tbranyen/diffhtml-rendercomplete)  <span style="color: #CCC;">| *Triggers a renderComplete Custom Event whenever diffHTML completes rendering.*</span>
- [Tooling](#tooling)
  - [Babel Tagged Template Optimizer](https://github.com/tbranyen/transform-tagged-diffhtml) <span style="color: #CCC;">| *Pre-compiles your tagged templates for better performance.*</span>
  - [Chrome DevTools](https://github.com/tbranyen/diffhtml-devtools) <span style="color: #CCC;">| *View render transactions, run benchmarks, and view old/new tree diffs.*</span>
- [Community](#community)
  - [Gitter](https://gitter.im/tbranyen/diffhtml)
  - [StackOverflow](https://gitter.im/tbranyen/diffhtml)
  - [Website](https://diffhtml.org)

## Features

[Back to quick jump...](#quick-jump)

- Aids you with writing components and composing applications. Think of it as
  the the View layer to reflect a Redux store.
- Code looks identical with or without a transpile step, making it completely
  optional, unlike JSX/HyperX based libraries.
- Real HTML with declarative inline event binding. Uses a loose parser and
  supports `class`, `value`, and `data-*` attributes without issue.
- A rich transitions API that animates your application and components with
  ease.
- Performance and memory management are core to this library. It is built with
  object recyling to keep memory constant and reduces garbage collection during
  tight loops.

#### File size

[Back to quick jump...](#quick-jump)

Pretty darn tiny once compressed at **9.9kb** minified + GZip. You can omit the
parser by requiring `diffhtml/runtime` instead, bringing the size down to
**8.5kb**!

  ``` shell
  # Full build  
   81K Jun 23 23:27 diffhtml.js
   43K Jun 23 23:28 diffhtml.min.js
  9.9K Jun 23 23:27 diffhtml.min.js.gz

  # Without the parser
   71K Jun 23 23:28 diffhtml-runtime.js
   38K Jun 23 23:28 diffhtml-runtime.min.js
  8.5K Jun 23 23:27 diffhtml-runtime.min.js.gz
  ```

#### Browser compatibility

[Back to quick jump...](#quick-jump)

Even though IE is marked as failing, it will work just fine. The error will be
resolved soon and chances are you will never see this message in the README.

<table>
  <thead>
    <tr style="font-weight: bold; text-align: center;">
      <th style="background-color: #FFF2CC;">IE (9/10/11)
      <th style="background-color: #FFF2CC;">Edge (13)
      <th style="background-color: #FFF2CC;">Firefox (47)
      <th style="background-color: #FFF2CC;">Chrome (51)
      <th style="background-color: #FFF2CC;">Safari (9.1)
      <th style="background-color: #FFF2CC;">Opera (38)
      <th style="background-color: #FFF2CC;">iOS iPhone Safari (9.3)
      <th style="background-color: #FFF2CC;">Android Chrome (50)
  <tbody>
    <tr style="font-weight: bold; text-align: center;">
      <td style="background-color: #F4CCCC;">✗
      <td style="background-color: #CEE2DC;">✓
      <td style="background-color: #CEE2DC;">✓
      <td style="background-color: #CEE2DC;">✓
      <td style="background-color: #CEE2DC;">✓
      <td style="background-color: #CEE2DC;">✓
      <td style="background-color: #CEE2DC;">✓
      <td style="background-color: #CEE2DC;">✓
</table>

##### Supporting legacy browsers

diffHTML uses many modern browser features, such as
[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set),
which are not available in [all
browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Browser_compatibility).

If you wish to use diffHTML in older browsers, make sure you have the [Babel
polyfill](https://babeljs.io/docs/usage/polyfill/) loaded first.

## How to install

[Back to quick jump...](#quick-jump)

The latest built version (but not necessarily the latest stable) is available
for quick download from the [master
branch](https://raw.githubusercontent.com/tbranyen/diffhtml/master/dist/diffhtml.js).
Use this to test the bleeding edge.

Or you can use npm:

``` sh
npm install diffhtml --save
```

The module can be required via Node or browser environments. It is exported as
a global named `diff` unless loaded as a module, in which case you determine
the name.

In the browser:

``` html
<script src="node_modules/diffhtml/dist/diffhtml.js"></script>

<script>diff.innerHTML(document.body, 'Hello world!');</script>
```

With CommonJS you can import the entire module:

``` javascript
const diff = require('diffhtml');

diff.innerHTML(document.body, 'Hello world!');
```

You can import only what you need if you're using ES Modules:

``` javascript
import { innerHTML } from 'diffhtml';

innerHTML(document.body, 'Hello world!');
```

#### Module format locations

[Back to quick jump...](#quick-jump)

This library is authored in vanilla ES2015 with no experimental syntax enabled, the syntax is ES Modules and is transpiled to CJS with Babel. The UMD build is generated by browserify.

| Format                   | Location
| ------------------------ | ---------------------------
| UMD (AMD/CJS/Browser)    | `diffhtml/dist/diffhtml.js`
| CJS                      | `diffhtml/dist/cjs/*`
| ES6                      | `diffhtml/lib/*`

## Quick start

[Back to quick jump](#quick-jump)

### Writing a component

[Back to quick jump](#quick-jump)

### Composing an application

[Back to quick jump](#quick-jump)

### Build optimizations

[Back to quick jump](#quick-jump)

## Documentation

[Back to quick jump...](#quick-jump)



### Lifecycle overview

[Back to quick jump...](#quick-jump)

#### Virtual Tree Abstraction

[Back to quick jump...](#quick-jump)

#### Middleware

[Back to quick jump...](#quick-jump)

##### Writing

[Back to quick jump...](#quick-jump)

##### Consuming

[Back to quick jump...](#quick-jump)

#### Coming from React

[Back to quick jump...](#quick-jump)

#### Building the input Virtual Tree

[Back to quick jump...](#quick-jump)

#### Invoking Middleware

[Back to quick jump...](#quick-jump)

#### Synchronizing the input tree into the original tree

[Back to quick jump...](#quick-jump)

#### Patching the DOM Node

[Back to quick jump...](#quick-jump)

#### Asynchronous transitions

[Back to quick jump...](#quick-jump)

#### Completing the render transaction

[Back to quick jump...](#quick-jump)

### Virtual Tree Abstraction

[Back to quick jump...](#quick-jump)

### Writing Middleware

[Back to quick jump...](#quick-jump)

### Coming from React

[Back to quick jump...](#quick-jump)

## API

[Back to quick jump...](#quick-jump)

The follow error types are exposed so you can test exceptions:

- TransitionStateError - Happens when errors occur during transitions.
- DOMException - Happens whenever a DOM manipulation fails.

#### Options

[Back to quick jump...](#quick-jump)

This is an optional argument that can be passed to any diff method. The `inner`
property can only be used with the element method.

- `inner` - Boolean that determines if `innerHTML` is used.

### Diff an element with markup

[Back to quick jump...](#quick-jump)

This method will take in a string of markup that matches the element root you
are diffing against.  This allows you to change attributes and text on the
main element.  This also allows you to change the `document.documentElement`.

You cannot override the `inner` options property here.


``` javascript
diff.outerHTML(document.body, '<body class="test"><h1>Hello world!</h1></body>');
```

### Diff an element's children with markup

[Back to quick jump...](#quick-jump)

This method also takes in a string of markup, but unlike `outerHTML` this is
children-only markup that will be nested inside the element passed.

You cannot override the `inner` options property here.


``` javascript
diff.innerHTML(document.body, '<h1>Hello world!</h1>');
```

### Diff an element to another element

[Back to quick jump...](#quick-jump)

Unlike the previous two methods, this will take in two elements and diff them
together.

The `inner` options property can be set here to change between inner/outerHTML.


``` javascript
var newBody = document.createElement('body');

newBody.innerHTML = '<h1>Hello world!</h1>';
newBody.setAttribute('class', 'test');

diff.element(document.body, newBody);
```

With `inner` set:

``` javascript
var h1 = document.createElement('h1');

h1.innerHTML = 'Hello world!';

diff.element(document.body, h1, { inner: true });
```

### Release element

Use this method if you need to clean up memory allocations and anything else
internal to diffHTML associated with your element. This is very useful for unit
testing and general cleanup when you're done with an element.

``` javascript
var h1 = document.createElement('h1');

h1.innerHTML = 'Hello world!';

diff.element(document.body, h1, { inner: true });
diff.release(document.body);
```

### Add a transition state callback

Adds a global transition listener.  With many elements this could be an
expensive operation, so try to limit the amount of listeners added if you're
concerned about performance.

Since the callback triggers with various elements, most of which you probably
don't care about, you'll want to filter.  A good way of filtering is to use the
DOM `matches` method.  It's fairly well supported
(http://caniuse.com/#feat=matchesselector) and may suit many projects.  If you
need backwards compatibility, consider using jQuery's `is`.

You can do fun, highly specific, filters:

``` javascript
addTransitionState('attached', function(element) {
  // Fade in the main container after it's attached into the DOM.
  if (element.matches('body main.container')) {
    $(element).stop(true, true).fadeIn();
  }
});
```

If you like these transitions and want to declaratively assign them in tagged
templates, check out the [diffhtml-inline-transitions
plugin](https://github.com/tbranyen/diffhtml-inline-transitions).

**Available states**

Format is: `name[callbackArgs]`

- `attached[element]`
  For when an element is attached to the DOM.
- `detached[element]`
  For when an element leaves the DOM.
- `replaced[oldElement, newElement]`
  For when elements are swapped
- `attributeChanged[element, attributeName, oldValue, newValue]` 
  For when attributes are changed.
- `textChanged[element, oldValue, newValue]`
  For when text has changed in either TextNodes or SVG text elements.

### A note about detached/replaced element accuracy

When rendering Nodes that contain lists of identical elements, you may not
receive the elements you expect in the detached and replaced transition state
hooks. This is a known limitation of string diffing and allows for better
performance. By default if no key is specified, the last element will be
removed and the subsequent elements from the one that was removed will be
mutated via replace.

This isn't really ideal. **At all.**

What you should do here is add a `key` attribute with a unique `value` that
persists between renders.

For example, when the following markup...

``` html
<ul>
  <li>Test</li>
  <li>This</li>
  <li>Out</li>
</ul>
```

...is changed into...

``` html
<ul>
  <li>Test</li>
  <li>Out</li>
</ul>
```

The transformative operations are:

1. Remove the last element
2. Replace the text of the second element to 'out'

What we intended, however, was to simply remove the second item. And to achieve
that, decorate your markup like so...

``` html
<ul>
  <li key="1">Test</li>
  <li key="2">This</li>
  <li key="3">Out</li>
</ul>
```

...and update with matching attributes...

``` html
<ul>
  <li key="1">Test</li>
  <li key="3">Out</li>
</ul>
```

Now the transformative operations are:

1. Remove the second element

### Remove a transition state callback

Removes a global transition listener.

When invoked with no arguments, this method will remove all transition
callbacks.  When invoked with the name argument it will remove all transition
state callbacks matching the name, and so on for the callback.

``` javascript
// Removes all registered transition states.
diff.removeTransitionState();

// Removes states by name.
diff.removeTransitionState('attached');

// Removes states by name and callback reference.
diff.removeTransitionState('attached', callbackReference);
```

### HTML

You can use the `diff.html` tagged template helper to build up dynamic trees in
a way that looks very similar to JSX.

For instance the following example:

``` javascript
const fixture = document.createElement('div');

function showUnixTime() {
  fixture.querySelector('span').innerHTML = Date.now();
}

diff.outerHTML(fixture, `
  <div>
    <button>Show current unix time</button>
    <span>${Date.now()}</span>
  </div>
`);

fixture.addEventListener('click', showUnixTime);
```

Could be rewritten with the helper as:

``` javascript
const fixture = document.createElement('div');

function showUnixTime() {
  fixture.querySelector('span').innerHTML = Date.now();
}

diff.outerHTML(fixture, html`
  <div onclick=${showUnixTime}>
    <button>Show current unix time</button>
    <span>${Date.now()}</span>
  </div>
`);
```

So this feature allows for inline binding of any DOM event, and sending dynamic
property data to any element.

Tagged templates also have no problem consuming other tagged templates (even
from arrays), so you will be able to do:

``` javascript
const fixture = document.createElement('div');

const listItems = ['diff', 'HTML', '♥'];

diff.outerHtml(fixture, html`
  <ul>
    ${listItems.map(item => html`<li>${item.text}</li>`)}
  </ul>
`);
```

### [Prollyfill](https://twitter.com/slexaxton/status/257543702124306432)

*Click above to learn what prollyfill "means".*

I'd love to see this project become a browser standard in the future.  To
enable how I'd envision it working, simply invoke the following method on the
diff object:

``` javascript
diff.enableProllyfill();
```

*Disclaimer: By calling this method, you are agreeing that it's okay for
diffHTML to modify your browser's `HTMLElement` constructor,
`Element.prototype`, the `document` object, and run some logic on your page
load event.*

##### `Element.prototype.diffOuterHTML`

Scans for changes in attributes and text on the parent, and all child nodes.

``` javascript
document.querySelector('main').diffOuterHTML = '<new markup to diff/>';
```

### `Element.prototype.diffInnerHTML`

Only scans for changes in child nodes.

``` javascript
document.querySelector('main').diffInnerHTML = '<new child markup to diff/>';
```

### `Element.prototype.diffElement`

Compares the two elements for changes like `outerHTML`, if you pass `{ inner:
true }` as the second argument it will act like `innerHTML`.

``` javascript
var newElement = document.createElement('main');
newElement.innerHTML = '<div></div>';

document.querySelector('main').diffElement(newElement);
```

### `Element.prototype.diffRelease`

Cleans up after diffHTML and removes the associated worker.

``` javascript
var newElement = document.createElement('main');
newElement.innerHTML = '<div></div>';

document.querySelector('main').diffRelease(newElement);
```

## Middleware

[Back to quick jump...](#quick-jump)

## Tooling

[Back to quick jump...](#quick-jump)

## Community

[Back to quick jump...](#quick-jump)

[More information and a demo are available on http://www.diffhtml.org/](http://www.diffhtml.org/)
