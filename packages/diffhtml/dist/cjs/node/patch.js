"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchNode;

var _create = _interopRequireDefault(require("./create"));

var _transition = require("../transition");

var _memory = require("../util/memory");

var _decodeEntities = _interopRequireDefault(require("../util/decode-entities"));

var _types = require("../util/types");

var _caches = require("../util/caches");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  keys
} = Object;
const blocklist = new Set();
const allowlist = new Set();
/**
 * Directly set this attributes, in addition to setting as properties.
 * @type {any}
 */

const DIRECT = ['class', 'checked', 'disabled', 'selected'];
/**
 * Sets an attribute on an element.
 *
 *
 * @param {VTree} vTree
 * @param {ValidNode} domNode
 * @param {string} name
 * @param {any} value
 *
 * @return
 */

const setAttribute = (vTree, domNode, name, value) => {
  // Triggered either synchronously or asynchronously depending on if a
  // transition was invoked.
  const isObject = typeof value === 'object' && value;
  const isFunction = typeof value === 'function';
  const isSymbol = typeof value === 'symbol';
  const isEvent = name.indexOf('on') === 0; // Events must be lowercased otherwise they will not be set correctly.

  const lowerName = isEvent ? name.toLowerCase() : name; // Runtime checking if the property can be set.

  const blocklistName = vTree.nodeName + '-' + lowerName;
  /** @type {HTMLElement} */

  const htmlElement = domNode; // Since this is a property value it gets set directly on the node.

  if (allowlist.has(blocklistName)) {
    /** @type {any} */
    domNode[lowerName] = value;
  } else if (!blocklist.has(blocklistName)) {
    try {
      /** @type {any} */
      domNode[lowerName] = value;
      allowlist.add(blocklistName);
    } catch (unhandledException) {
      blocklist.add(blocklistName);
    }
  } // If the value is not an object, function, or symbol, then attempt to
  // set as an attribute. If the value is one of the excluded types, they
  // will be set below.


  if (!isObject && !isFunction && !isSymbol) {
    const noValue = value === null || value === undefined; // If we cannot set the value as a property, try as an attribute.

    if (lowerName) {
      htmlElement.setAttribute(lowerName, noValue ? _types.EMPTY.STR : value);
    }
  } // Support patching an object representation of the style object.
  else if (isObject && lowerName === 'style') {
      const valueKeys =
      /** @type {any} */
      keys(value);

      for (let i = 0; i < valueKeys.length; i++) {
        htmlElement.style[valueKeys[i]] = value[valueKeys[i]];
      }
    }
};
/**
 * Removes an attribute from an element.
 *
 * @param {ValidNode} domNode
 * @param {string} name
 */


const removeAttribute = (domNode, name) => {
  const isEvent = name.indexOf('on') === 0;
  /** @type {HTMLElement} */

  domNode.removeAttribute(name); // Runtime checking if the property can be set.

  const blocklistName =
  /** @type {HTMLElement} */
  domNode.nodeName + '-' + name;

  if (allowlist.has(blocklistName)) {
    const anyNode =
    /** @type {any} */
    domNode;

    if (isEvent) {
      anyNode[name] = undefined;
    } else {
      delete anyNode[name];
    }

    if (DIRECT.includes(name)) {
      /** @type {any} */
      domNode[name] = false;
    }
  } else if (!blocklist.has(blocklistName)) {
    try {
      const anyNode =
      /** @type {any} */
      domNode;

      if (isEvent) {
        anyNode[name] = undefined;
      } else {
        delete anyNode[name];
      }

      if (DIRECT.includes(name)) {
        /** @type {any} */
        domNode[name] = false;
      }

      allowlist.add(blocklistName);
    } catch (unhandledException) {
      blocklist.add(blocklistName);
    }
  }
};
/**
 * Changes the nodeValue (text) content of an element.
 *
 * @param {ValidNode} domNode
 * @param {string} nodeValue
 */


const changeNodeValue = (domNode, nodeValue) => {
  const htmlElement =
  /** @type {HTMLElement} */
  domNode;

  if (nodeValue.includes('&')) {
    htmlElement.nodeValue = (0, _decodeEntities.default)(nodeValue);
  } else {
    htmlElement.nodeValue = nodeValue;
  }
};
/**
 *
 * @param {*} patches
 * @param {*} state
 */


function patchNode(patches, state = _types.EMPTY.OBJ) {
  const promises = [];
  const {
    ownerDocument,
    svgElements = new Set()
  } = state;
  const {
    length
  } = patches;
  let i = 0;

  while (true) {
    const patchType = patches[i];

    if (i === length) {
      break;
    }

    switch (patchType) {
      case _types.PATCH_TYPE.SET_ATTRIBUTE:
        {
          const vTree = patches[i + 1];
          const name = patches[i + 2];
          const value = (0, _decodeEntities.default)(patches[i + 3]);
          i += 4;
          const isSVG = svgElements.has(vTree);
          const domNode =
          /** @type {HTMLElement} */
          (0, _create.default)(vTree, ownerDocument, isSVG);

          if (!domNode) {
            break;
          }

          const oldValue = domNode.getAttribute(name);
          const attributeChangedPromises = (0, _transition.runTransitions)('attributeChanged', vTree, name, oldValue, value);
          (0, _memory.protectVTree)(vTree);

          if (attributeChangedPromises.length) {
            Promise.all(attributeChangedPromises).then(() => setAttribute(vTree, domNode, name, value));
            promises.push(...attributeChangedPromises);
          } else {
            setAttribute(vTree, domNode, name, value);
          }

          break;
        }

      case _types.PATCH_TYPE.REMOVE_ATTRIBUTE:
        {
          const vTree = patches[i + 1];
          const name = patches[i + 2];
          i += 3;
          const isSVG = svgElements.has(vTree);
          const domNode =
          /** @type {HTMLElement} */
          (0, _create.default)(vTree, ownerDocument, isSVG);

          if (!domNode) {
            break;
          }

          const oldValue = domNode.getAttribute(name);
          const attributeChangedPromises = (0, _transition.runTransitions)('attributeChanged', vTree, name, oldValue, null);
          (0, _memory.protectVTree)(vTree);

          if (attributeChangedPromises.length) {
            Promise.all(attributeChangedPromises).then(() => removeAttribute(domNode, name));
            promises.push(...attributeChangedPromises);
          } else {
            removeAttribute(domNode, name);
          }

          break;
        }

      case _types.PATCH_TYPE.NODE_VALUE:
        {
          const vTree = patches[i + 1];
          const nodeValue = patches[i + 2];
          const oldValue = patches[i + 3];
          const isSVG = svgElements.has(vTree);
          i += 4;
          const domNode =
          /** @type {Text} */
          (0, _create.default)(vTree, ownerDocument, isSVG);

          if (!domNode) {
            break;
          }

          (0, _memory.protectVTree)(vTree);
          const textChangedPromises = (0, _transition.runTransitions)('textChanged', vTree, oldValue, nodeValue);

          if (textChangedPromises.length) {
            Promise.all(textChangedPromises).then(() => changeNodeValue(domNode, nodeValue));
            promises.push(...textChangedPromises);
          } else {
            changeNodeValue(domNode, nodeValue);
          }

          break;
        }

      case _types.PATCH_TYPE.INSERT_BEFORE:
        {
          const vTree = patches[i + 1];
          const newTree = patches[i + 2];
          const refTree = patches[i + 3];
          i += 4; // First attempt to locate a pre-existing DOM Node. If one hasn't been
          // created there could be a few reasons.

          let domNode =
          /** @type {HTMLElement} */
          _caches.NodeCache.get(vTree); // Patching without an existing DOM Node is a mistake, so we should not
          // attempt to do anything in this case.


          if (!domNode) {
            break;
          }

          const isSVG = svgElements.has(newTree);
          (0, _memory.protectVTree)(newTree);
          const refNode = refTree &&
          /** @type {HTMLElement} */
          (0, _create.default)(refTree, ownerDocument, isSVG);
          const newNode =
          /** @type {HTMLElement} */
          (0, _create.default)(newTree, ownerDocument, isSVG); // If refNode is `undefined` then it will simply append like
          // `appendChild`.

          domNode.insertBefore(newNode, refNode || null);
          promises.push(...(0, _transition.runTransitions)('attached', newTree));
          break;
        }

      case _types.PATCH_TYPE.REPLACE_CHILD:
        {
          var _TransitionCache$get, _TransitionCache$get2, _TransitionCache$get3;

          const newTree = patches[i + 1];
          const oldTree = patches[i + 2];
          i += 3;
          const isSVG = svgElements.has(newTree);

          const oldDomNode =
          /** @type {HTMLElement} */
          _caches.NodeCache.get(oldTree);

          const newDomNode =
          /** @type {HTMLElement} */
          (0, _create.default)(newTree, ownerDocument, isSVG); // Patching without an existing DOM Node is a mistake, so we should not
          // attempt to do anything in this case.

          if (!oldDomNode || !oldDomNode.parentNode) {
            break;
          } // Ensure the `newTree` is protected before any DOM operations occur.
          // This is due to the `connectedCallback` in Web Components firing off,
          // and possibly causing a `gc()` to wipe this out.


          (0, _memory.protectVTree)(newTree); // Check if there are any transitions, if none, then we can skip
          // inserting and removing, and instead use a much faster replaceChild.

          const hasAttached = (_TransitionCache$get = _caches.TransitionCache.get('attached')) === null || _TransitionCache$get === void 0 ? void 0 : _TransitionCache$get.size;
          const hasDetached = (_TransitionCache$get2 = _caches.TransitionCache.get('detached')) === null || _TransitionCache$get2 === void 0 ? void 0 : _TransitionCache$get2.size;
          const hasReplaced = (_TransitionCache$get3 = _caches.TransitionCache.get('replaced')) === null || _TransitionCache$get3 === void 0 ? void 0 : _TransitionCache$get3.size; // In the hot path, ensure we always use the fastest operation given
          // the constraints. If there are no transitions, do not use the more
          // expensive, but more expressive path.

          if (!hasAttached && !hasDetached && !hasReplaced) {
            if (oldDomNode.parentNode) {
              (0, _memory.unprotectVTree)(oldTree);
              oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            }

            break;
          } // Always insert before to allow the element to transition.


          if (oldDomNode.parentNode) {
            oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
          }

          const attachedPromises = (0, _transition.runTransitions)('attached', newTree);
          const detachedPromises = (0, _transition.runTransitions)('detached', oldTree);
          const replacedPromises = (0, _transition.runTransitions)('replaced', oldTree, newDomNode);
          const allPromises = [...attachedPromises, ...detachedPromises, ...replacedPromises];

          if (allPromises.length) {
            // Do full replace and cleanup once transitions have completed.
            Promise.all(allPromises).then(() => {
              if (oldDomNode.parentNode) {
                oldDomNode.parentNode.removeChild(oldDomNode);
              }

              (0, _memory.unprotectVTree)(oldTree);
            });
            promises.push(...allPromises);
          } else {
            if (oldDomNode.parentNode) {
              oldDomNode.parentNode.removeChild(oldDomNode);
            }

            (0, _memory.unprotectVTree)(oldTree);
          }

          break;
        }

      case _types.PATCH_TYPE.REMOVE_CHILD:
        {
          const vTree = patches[i + 1];
          i += 2;

          const domNode =
          /** @type {HTMLElement} */
          _caches.NodeCache.get(vTree);

          if (!domNode || !domNode.parentNode) {
            break;
          }

          const detachedPromises = (0, _transition.runTransitions)('detached', vTree);

          if (detachedPromises.length) {
            Promise.all(detachedPromises).then(() => {
              if (domNode.parentNode) {
                domNode.parentNode.removeChild(domNode);
              }

              (0, _memory.unprotectVTree)(vTree);
            });
            promises.push(...detachedPromises);
          } else {
            if (domNode.parentNode) {
              domNode.parentNode.removeChild(domNode);
            }

            (0, _memory.unprotectVTree)(vTree);
          }

          break;
        }
    }
  }

  return promises;
}

module.exports = exports.default;