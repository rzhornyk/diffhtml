# Getting started

## About

diffHTML is a library that helps render reactive views on the web. It is very
similar in scope to [React](https://reactjs.org/), [Choo](https://choo.io/),
and [Vue](https://vuejs.org), along with many others that assist with creating
dynamic and declarative user interfaces. You can use it to make games, data
visualizations, web applications, or any other kind of reactive user interface.
The API is designed to be revealing and only discoverable once you need the
particular feature. This makes it very welcoming to new and intermediate web
developers.

## Installing

We encourage brand new developers who want to try diffHTML to use our pre-made
Glitch examples. This will let you mess with the API without having to download
or configure anything on your own.

If you would like to use it on your own, you may want to use the HTTPS, npm, or
yarn approach. Reference the [API Access documentation](/api#accessing-the-api
a) for more information on using one of the techniques below.

* **HTTPS**

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

## Glitch Examples

[Glitch](https://glitch.com) is a fantastic site that allows you to create full
applications and demos and get version control/hosting out-of-the-box. It is
ideally suited for tutorials as it allows users to ask questions and interact
with the code by forking/"remixing".

Each one of the following examples contains source code to run the example,
usually not commented unless something is expecially complicated in the source
code. The code is then dissected and commented in the README which you can
follow to learn how the example is created.

- **[Minimalist Clock](https://diffhtml-clock.glitch.me)** - [Tutorial/README](https://glitch.com/edit/#!/diffhtml-clock?path=README.md:1:0)
