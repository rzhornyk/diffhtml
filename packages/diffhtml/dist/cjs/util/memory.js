"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectVTree = protectVTree;
exports.unprotectVTree = unprotectVTree;
exports.gc = gc;

var _pool = _interopRequireDefault(require("./pool"));

var _caches = require("./caches");

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  protect,
  unprotect,
  memory
} = _pool.default;
/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param {VTree} vTree
 * @return vTree
 */

function protectVTree(vTree) {
  protect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}
/**
 * Recyles a VTree by deallocating, removing its DOM Node reference, and
 * recursively applying to all nested children.
 *
 * @param {VTree} vTree
 * @return
 */


function unprotectVTree(vTree) {
  unprotect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  _caches.NodeCache.delete(vTree);

  return vTree;
}
/**
 * Collects any unused VTree's and puts them back into the free Set. This is
 * primarily used by tests, but could also be useful for specific niche cases
 * as a way to ease memory/CPU pressure when lots of temporary trees are
 * created but never used.
 */


function gc() {
  // Ensure all detached VTree's are properly cleaned up.
  memory.allocated.forEach(vTree => {
    memory.free.add(vTree);
    memory.allocated.delete(vTree);

    _caches.NodeCache.delete(vTree);
  });
}