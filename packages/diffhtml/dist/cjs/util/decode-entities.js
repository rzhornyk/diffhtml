"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = decodeEntities;

var _global = _interopRequireDefault(require("./global"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Support loading diffHTML in non-browser environments.
const element =
/** @type {any} */
_global.default.document ? document.createElement('div') : null;
/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param {string} string - Incoming string HTML
 * @return {string} Unescaped HTML
 */

function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent || _types.EMPTY.STR;
}

module.exports = exports.default;