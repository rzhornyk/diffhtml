"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindingSymbol = exports.default = void 0;

/** @type {unknown} */
var _default = typeof global === 'object' ? global : window || {};

exports.default = _default;
const bindingSymbol = Symbol.for('diffHTML');
exports.bindingSymbol = bindingSymbol;