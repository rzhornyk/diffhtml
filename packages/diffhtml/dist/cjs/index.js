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
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _html.default;
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
Object.defineProperty(exports, "VERSION", {
  enumerable: true,
  get: function () {
    return _version.__VERSION__;
  }
});
exports.default = void 0;

var _create = _interopRequireDefault(require("./tree/create"));

var _parseNewTree = _interopRequireDefault(require("./tasks/parse-new-tree"));

var _reconcileTrees = _interopRequireDefault(require("./tasks/reconcile-trees"));

var _internals = _interopRequireDefault(require("./util/internals"));

var _parse = _interopRequireDefault(require("./util/parse"));

var _global = _interopRequireWildcard(require("./util/global"));

var _innerHtml = _interopRequireDefault(require("./inner-html"));

var _outerHtml = _interopRequireDefault(require("./outer-html"));

var _transaction = require("./transaction");

var _html = _interopRequireDefault(require("./html"));

var _release = _interopRequireDefault(require("./release"));

var _use = _interopRequireDefault(require("./use"));

var _transition = require("./transition");

var _version = require("./version");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// At startup inject the HTML parser into the default set of tasks.
_transaction.defaultTasks.splice(_transaction.defaultTasks.indexOf(_reconcileTrees.default), 0, _parseNewTree.default); // Add build flavor internals when executed.


_internals.default.parse = _parse.default;
_internals.default.VERSION = _version.__VERSION__; // Build up the full public API.

const api = {};
api.VERSION = _version.__VERSION__;
api.addTransitionState = _transition.addTransitionState;
api.removeTransitionState = _transition.removeTransitionState;
api.release = _release.default;
api.createTree = _create.default;
api.use = _use.default;
api.outerHTML = _outerHtml.default;
api.innerHTML = _innerHtml.default;
api.html = _html.default;
api.Internals = _internals.default;
/** @type {any} */

const global = _global.default; // Bind the API into the global scope. Allows middleware and other code to
// reference the core API.

const hasBinding = (_global.bindingSymbol in _global.default); // The first API binding wins and if you use static-sync or accidentally bundle
// multiple versions they will not cause conflicts.

if (hasBinding) {
  const existingApi = global[_global.bindingSymbol];

  if (_version.__VERSION__ !== existingApi.VERSION) {
    console.log(`Tried to load ${_version.__VERSION__} after ${existingApi.VERSION}`);
  }
} else {
  global[_global.bindingSymbol] = api; // Automatically hook up to DevTools if they are present.

  if (global.devTools) {
    global.unsubscribeDevTools = (0, _use.default)(global.devTools(_internals.default));
  }
}

var _default = api;
exports.default = _default;