"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseNewTree;

var _parse = _interopRequireDefault(require("../util/parse"));

var _create = _interopRequireDefault(require("../tree/create"));

var _transaction = _interopRequireDefault(require("../transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Transaction} transaction
 */
function parseNewTree(transaction) {
  const {
    state,
    markup,
    options
  } = transaction;
  const {
    measure
  } = state;
  const {
    inner
  } = options;

  if (typeof markup === 'string') {
    measure('parsing markup for new tree');
    const {
      childNodes
    } = (0, _parse.default)(markup, undefined, options); // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.

    const vTree = (0, _create.default)(inner ? childNodes : childNodes[0] || childNodes);

    if (vTree) {
      transaction.newTree = vTree;
    }

    measure('parsing markup for new tree');
  }
}

module.exports = exports.default;