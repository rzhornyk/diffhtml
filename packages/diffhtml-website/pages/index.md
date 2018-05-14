# Getting started

## About

diffHTML is a view library used to create reactive interfaces on the web. You
would use it in the same way as tools like [React](https://reactjs.org/) and
[Vue](https://vuejs.org/), along with many others that assist with creative
rich user interfaces.

Unlike raw imperative DOM APIs, diffHTML offers a declarative approach which
allows for easily modifying DOM state. This is demonstrated below showing a
basic _Hello world_ example.

**Imperative (Native APIs):**

``` javascript
// Manually create container.
const div = document.createElement('div');

// Update the content using the `innerHTML` property.
div.innerHTML = 'Hello world';

// Add into the page body.
document.body.appendChild(div);

// Update only the text.
div.textContent = 'Hello updated world!';
```

**Declarative (Using diffHTML):**

``` javascript
// Declaratively create a DIV with the content and append into the page body.
diff.innerHTML(document.body, '<div>Hello world</div>');

// diffHTML will diff the changes and detect it only needs to update text.
diff.innerHTML(document.body, '<div>Hello updated world!</div>');
```

**Q:** But what if we modify the DOM manually, won't this throw off the
comparator engine?

**A:** The engine is smart and compares the node before every operation and
snapshots after every operation to ensure the node has not been modified. If the
node has, the engine calculates an updated version of the tree.


Unlike React, the core engine of diffHTML was designed with the browser in mind
first so includes the DOM rendering engine. This makes diffHTML suitable for
web applications with a single package.

The core of diffHTML is a powerful and easy-to-use virtual dom library that can
help devs get from the basics to something like React. Being designed to be
flexible and allow graceful. Use HTML or JSX, they both get normalized to the
same DOM tree. You can diff plain HTML strings, or get fancy with a tagged
template handler that will allow you to get React-like capabilities without
needing a build step.

## Installing

We encourage brand new developers who want to try diffHTML to use our pre-made
Glitch examples. This will let you mess with the API without having to download
or configure anything.

* CDN (Recommended for Beginners):

  ```
  <script src="https://diffhtml.org/master/diffhtml/dist/diffhtml.js"></script>
  ```

* <svg viewBox="0 0 18 7" width="40" style="position: relative; top: 2px;">
    <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
    <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
  </svg>

  ``` sh
  npm install diffhtml
  ```

* <img width="60" src="images/yarn-logo.svg">

  ``` sh
  yarn add diffhtml
  ```

_While `diffhtml` is the core package to install, there are many other modules you may also want to install depending on your use cases._
