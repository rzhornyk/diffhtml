"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.runTransitions = runTransitions;

var _caches = require("./util/caches");

var _process = _interopRequireDefault(require("./util/process"));

var _types = require("./util/types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {TransitionStateName} stateName
 * @param {Function} callback
 * @return {void}
 */
function addTransitionState(stateName, callback) {
  var _TransitionCache$get;

  if (_process.default.env.NODE_ENV !== 'production') {
    if (!_types.TransitionStateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  (_TransitionCache$get = _caches.TransitionCache.get(stateName)) === null || _TransitionCache$get === void 0 ? void 0 : _TransitionCache$get.add(callback);
}
/**
 *
 * @param {TransitionStateName=} stateName
 * @param {Function=} callback
 * @return {void}
 */


function removeTransitionState(stateName, callback) {
  if (_process.default.env.NODE_ENV !== 'production') {
    // Only validate the stateName if the caller provides one.
    if (stateName && !_types.TransitionStateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }
  } // Remove all specific transition callbacks.


  if (!callback && stateName) {
    var _TransitionCache$get2;

    (_TransitionCache$get2 = _caches.TransitionCache.get(stateName)) === null || _TransitionCache$get2 === void 0 ? void 0 : _TransitionCache$get2.clear();
  } // Remove a single distinct transition callback.
  else if (stateName && callback) {
      var _TransitionCache$get3;

      (_TransitionCache$get3 = _caches.TransitionCache.get(stateName)) === null || _TransitionCache$get3 === void 0 ? void 0 : _TransitionCache$get3.delete(callback);
    } // Remove all transition callbacks.
    else {
        for (let i = 0; i < _types.TransitionStateNames.length; i++) {
          var _TransitionCache$get4;

          (_TransitionCache$get4 = _caches.TransitionCache.get(_types.TransitionStateNames[i])) === null || _TransitionCache$get4 === void 0 ? void 0 : _TransitionCache$get4.clear();
        }
      }
}
/**
 *
 * @param {TransitionStateName} setName
 * @param  {...any} args
 *
 * @return {Promise<any>[]}
 */


function runTransitions(setName, ...args) {
  const set = _caches.TransitionCache.get(setName);
  /** @type {Promise<any>[]} */


  const promises = [];

  if (!set) {
    return promises;
  }

  const [vTree, ...rest] = args; // Filter out text nodes and fragments from transition callbacks.

  if (!set.size || setName !== 'textChanged' && vTree.nodeType !== 1) {
    return promises;
  } // Run each transition callback, but only if the passed args are an
  // Element.


  set.forEach(callback => {
    const retVal = callback(_caches.NodeCache.get(vTree), ...rest); // Is a `thennable` object or Native Promise.

    if (typeof retVal === 'object' && retVal.then) {
      promises.push(retVal);
    }
  }); // For attached and detached transitions, dig into children to ensure
  // all are run with this.

  if (setName === 'attached' || setName === 'detached') {
    vTree.childNodes.forEach(
    /** @type {VTree} */
    childTree => {
      promises.push(...runTransitions(setName, childTree, ...rest));
    });
  }

  return promises;
}