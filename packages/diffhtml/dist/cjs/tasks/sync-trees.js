"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTrees;

var _sync = _interopRequireDefault(require("../tree/sync"));

var _create = _interopRequireDefault(require("../node/create"));

var _caches = require("../util/caches");

var _types = require("../util/types");

var _process = _interopRequireDefault(require("../util/process"));

var _transaction = _interopRequireDefault(require("../transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function syncTrees(
/** @type {Transaction} */
transaction) {
  const {
    state,
    state: {
      measure
    },
    oldTree,
    newTree,
    domNode
  } = transaction;
  measure('sync trees');

  if (_process.default.env.NODE_ENV !== 'production') {
    if (!oldTree) {
      throw new Error('Missing old tree during synchronization');
    }

    if (!newTree) {
      throw new Error('Missing new tree during synchronization');
    }
  } // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.


  if (oldTree && newTree && oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // If there is no `parentNode` for the replace operation, we will need to
    // throw an error and prevent the `StateCache` from being updated.
    if (_process.default.env.NODE_ENV !== 'production') {
      if (!
      /** @type {HTMLElement} */
      domNode.parentNode) {
        throw new Error('Unable to replace top level node without a parent');
      }
    } // Replace the top level elements.


    transaction.patches = [_types.PATCH_TYPE.REPLACE_CHILD, newTree, oldTree]; // Clean up the existing old tree, and mount the new tree.

    transaction.oldTree = state.oldTree = newTree;
    const newNode = (0, _create.default)(newTree); // Update the StateCache since we are changing the top level element.

    _caches.StateCache.delete(domNode);

    _caches.StateCache.set(
    /** @type {Mount} */
    newNode, state);

    transaction.domNode =
    /** @type {HTMLElement} */
    newNode;

    if (newTree.nodeName === 'script') {
      state.scriptsToExecute.set(newTree, newTree.attributes.type || _types.EMPTY.STR);
    }
  } // Synchronize the top level elements.
  else {
      transaction.patches = (0, _sync.default)(oldTree || null, newTree || null, [], state);
    }

  measure('sync trees');
}

module.exports = exports.default;