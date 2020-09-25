"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _patch = _interopRequireDefault(require("../node/patch"));

var _transaction = _interopRequireDefault(require("../transaction"));

var _caches = require("../util/caches");

var _types = require("../util/types");

var _global = _interopRequireDefault(require("../util/global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Transaction} transaction
 * @return {void}
 */
function patch(transaction) {
  const {
    domNode,
    state,
    state: {
      measure,
      scriptsToExecute
    },
    patches
  } = transaction;
  const {
    ownerDocument
  } =
  /** @type {HTMLElement} */
  domNode;
  const promises = transaction.promises || [];
  state.ownerDocument = ownerDocument || _global.default.document; // Hook into the Node creation process to find all script tags, and mark them
  // for execution.

  const collectScripts =
  /** @type {VTree} */
  vTree => {
    if (vTree.nodeName === 'script') {
      scriptsToExecute.set(vTree, vTree.attributes.type);
    }
  };

  _caches.CreateNodeHookCache.add(collectScripts);

  measure('patch node');
  promises.push(...(0, _patch.default)(patches, state));
  measure('patch node');

  _caches.CreateNodeHookCache.delete(collectScripts);

  transaction.promises = promises;
}

module.exports = exports.default;