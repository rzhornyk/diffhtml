"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reconcileTrees;

var _caches = require("../util/caches");

var _memory = require("../util/memory");

var _create = _interopRequireDefault(require("../tree/create"));

var _transaction = _interopRequireDefault(require("../transaction"));

var _release = _interopRequireDefault(require("../release"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This task ensures that the Virtual DOM matches the Browser DOM. If any of the
 * markup changes between renders, the old tree is recalculated to ensure accuracy.
 *
 * @param {Transaction} transaction
 */
function reconcileTrees(transaction) {
  const {
    state,
    domNode,
    markup,
    options
  } = transaction;
  const {
    previousMarkup
  } = state;
  const {
    inner
  } = options;
  const domNodeAsHTMLEl =
  /** @type {HTMLElement} */
  domNode;
  const {
    outerHTML
  } = domNodeAsHTMLEl; // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.

  if (previousMarkup !== outerHTML || !state.oldTree || !outerHTML) {
    (0, _release.default)(domNode);
    state.oldTree = (0, _create.default)(domNodeAsHTMLEl);
    (0, _memory.protectVTree)(state.oldTree); // Reset the state cache after releasing.

    _caches.StateCache.set(domNode, state);
  } // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).


  if (!transaction.newTree) {
    // Reset the old tree with the newly created VTree association.
    transaction.newTree = (0, _create.default)(markup);
  } // Associate the old tree with this brand new transaction.


  transaction.oldTree = state.oldTree;
  const {
    oldTree,
    newTree
  } = transaction; // If we are diffing only the parent's childNodes, then adjust the newTree to
  // be a replica of the oldTree except with the childNodes changed.

  if (inner && oldTree && newTree) {
    const {
      nodeName,
      attributes
    } = oldTree;
    const isUnknown = typeof newTree.rawNodeName !== 'string';
    const isFragment = newTree.nodeType === 11;
    const children = isFragment && !isUnknown ? newTree.childNodes : newTree;
    transaction.newTree = (0, _create.default)(nodeName, attributes, children);
  }
}

module.exports = exports.default;