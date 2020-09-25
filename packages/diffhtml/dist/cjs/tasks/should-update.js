"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldUpdate;

var _transaction = _interopRequireDefault(require("../transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Allows the transaction to terminate early if no contents have changed.
 *
 * @param {Transaction} transaction
 */
function shouldUpdate(transaction) {
  const {
    domNode,
    markup,
    state,
    state: {
      measure
    },
    options
  } = transaction;
  const prop = options.inner ? 'innerHTML' : 'outerHTML';
  measure('should update');
  const domNodeAsEl =
  /** @type {HTMLElement} */
  domNode; // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.

  if (typeof markup === 'string' && domNodeAsEl[prop] === markup) {
    return transaction.abort(true);
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}

module.exports = exports.default;