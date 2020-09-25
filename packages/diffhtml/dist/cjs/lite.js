"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createTree", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "Internals", {
  enumerable: true,
  get: function () {
    return _internals.default;
  }
});
Object.defineProperty(exports, "innerHTML", {
  enumerable: true,
  get: function () {
    return _innerHtml.default;
  }
});
Object.defineProperty(exports, "outerHTML", {
  enumerable: true,
  get: function () {
    return _outerHtml.default;
  }
});
Object.defineProperty(exports, "release", {
  enumerable: true,
  get: function () {
    return _release.default;
  }
});
Object.defineProperty(exports, "use", {
  enumerable: true,
  get: function () {
    return _use.default;
  }
});
Object.defineProperty(exports, "addTransitionState", {
  enumerable: true,
  get: function () {
    return _transition.addTransitionState;
  }
});
Object.defineProperty(exports, "removeTransitionState", {
  enumerable: true,
  get: function () {
    return _transition.removeTransitionState;
  }
});
exports.default = exports.VERSION = void 0;

var _create = _interopRequireDefault(require("./tree/create"));

var _internals = _interopRequireDefault(require("./util/internals"));

var _global = _interopRequireWildcard(require("./util/global"));

var _innerHtml = _interopRequireDefault(require("./inner-html"));

var _outerHtml = _interopRequireDefault(require("./outer-html"));

var _release = _interopRequireDefault(require("./release"));

var _use = _interopRequireDefault(require("./use"));

var _transition = require("./transition");

var _version = require("./version");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  assign
} = Object;
const VERSION = `${_version.__VERSION__}-lite`; // Exposes the Internal APIs which may change. Once this project reaches a
// stable version, this will only be able to break between major versions.

exports.VERSION = VERSION;
assign(_internals.default, {
  VERSION
});
const api = {};
api.VERSION = VERSION;
api.addTransitionState = _transition.addTransitionState;
api.removeTransitionState = _transition.removeTransitionState;
api.release = _release.default;
api.createTree = _create.default;
api.use = _use.default;
api.outerHTML = _outerHtml.default;
api.innerHTML = _innerHtml.default;
api.html = _create.default;
api.Internals = _internals.default;
/** @type {any} */

const global = _global.default; // Bind the API into the global scope. Allows middleware and other code to
// reference the core API.

const hasBinding = (_global.bindingSymbol in _global.default); // The first API binding wins and if you use static-sync or accidentally bundle
// multiple versions they will not cause conflicts.

if (hasBinding) {
  const existingApi = global[_global.bindingSymbol];

  if (VERSION !== existingApi.VERSION) {
    console.log(`Tried to load ${VERSION} after ${existingApi.VERSION}`);
  } // Merge the existing API in.


  assign(api, global[_global.bindingSymbol]);
} else {
  global[_global.bindingSymbol] = api; // Automatically hook up to DevTools if they are present.

  if (global.devTools) {
    global.unsubscribeDevTools = (0, _use.default)(global.devTools(_internals.default));
  }
}

var _default = api;
exports.default = _default;