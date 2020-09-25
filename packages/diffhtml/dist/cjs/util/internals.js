"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transaction = _interopRequireWildcard(require("../transaction"));

var _create = _interopRequireDefault(require("../node/create"));

var _sync = _interopRequireDefault(require("../tree/sync"));

var caches = _interopRequireWildcard(require("./caches"));

var _decodeEntities = _interopRequireDefault(require("./decode-entities"));

var _escape = _interopRequireDefault(require("./escape"));

var _makeMeasure = _interopRequireDefault(require("./make-measure"));

var memory = _interopRequireWildcard(require("./memory"));

var _pool = _interopRequireDefault(require("./pool"));

var _process = _interopRequireDefault(require("./process"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default =
/** @type {Internals} */
_objectSpread({
  // Utils.
  decodeEntities: _decodeEntities.default,
  escape: _escape.default,
  makeMeasure: _makeMeasure.default,
  memory,
  Pool: _pool.default,
  process: _process.default,
  PATCH_TYPE: _types.PATCH_TYPE,
  // Core.
  createNode: _create.default,
  syncTree: _sync.default,
  // Tasks.
  Transaction: _transaction.default,
  defaultTasks: _transaction.defaultTasks,
  tasks: _transaction.tasks
}, caches);

exports.default = _default;
module.exports = exports.default;