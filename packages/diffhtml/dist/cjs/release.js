"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = release;

var _caches = require("./util/caches");

var _memory = require("./util/memory");

var _types = require("./util/types");

/**
 * Releases state and memory associated to a DOM Node.
 *
 * @param {Mount} domNode - Valid input node
 */
function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = _caches.StateCache.get(domNode); // If this was a top-level rendered element, deallocate the VTree
  // and remove the StateCache reference.


  if (state) {
    _caches.StateCache.delete(domNode); // If there is a known root association that is not in the NodeCache,
    // remove this VTree.


    if (state.oldTree && !_caches.NodeCache.has(state.oldTree)) {
      (0, _memory.unprotectVTree)(state.oldTree);

      _caches.ReleaseHookCache.forEach(fn => fn(state.oldTree));
    }
  } // The rest of this function only pertains to real HTML element nodes. If
  // this is undefined, then it isn't one.


  if (!domNode) {
    return;
  }

  const asHTMLElement =
  /** @type {HTMLElement} */
  domNode; // Crawl the childNodes if this is an HTMLElement for state trees.

  if (asHTMLElement.childNodes && asHTMLElement.childNodes.length) {
    for (let i = 0; i < asHTMLElement.childNodes.length; i++) {
      release(asHTMLElement.childNodes[i]);
    }
  } // If there is a shadowRoot attached to the DOM node, attempt
  // to release this as well.


  if (asHTMLElement.shadowRoot) {
    release(asHTMLElement.shadowRoot);
  } // Do a thorough check within the NodeCache to fully deallocate all
  // references to the associated trees.


  _caches.NodeCache.forEach((domNode, vTree) => {
    if (domNode === asHTMLElement) {
      (0, _memory.unprotectVTree)(vTree);

      _caches.ReleaseHookCache.forEach(fn => fn(vTree));
    }
  });
}

module.exports = exports.default;