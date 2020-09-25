"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = outerHTML;

var _transaction = _interopRequireWildcard(require("./transaction"));

var _types = require("./util/types");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 *
 * @param {Mount} domNode
 * @param {ValidInput} input
 * @param {Options} options
 *
 * @return {Promise<Transaction> | unknown}
 */
function outerHTML(domNode, input = _types.EMPTY.STR, options = _types.EMPTY.OBJ) {
  options.inner = false;
  options.tasks = options.tasks || _transaction.defaultTasks;
  options.executeScripts = 'executeScripts' in options ? options.executeScripts : true;
  return _transaction.default.create(domNode, input, options).start();
}

module.exports = exports.default;