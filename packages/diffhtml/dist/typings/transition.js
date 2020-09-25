import { TransitionCache, NodeCache } from './util/caches';
import process from './util/process';
import { TransitionStateNames } from './util/types';
/**
 *
 * @param {TransitionStateName} stateName
 * @param {Function} callback
 * @return {void}
 */
export function addTransitionState(stateName, callback) {
    var _a;
    if (process.env.NODE_ENV !== 'production') {
        if (!TransitionStateNames.includes(stateName)) {
            throw new Error(`Invalid state name '${stateName}'`);
        }
        if (!callback) {
            throw new Error('Missing transition state callback');
        }
    }
    (_a = TransitionCache.get(stateName)) === null || _a === void 0 ? void 0 : _a.add(callback);
}
/**
 *
 * @param {TransitionStateName=} stateName
 * @param {Function=} callback
 * @return {void}
 */
export function removeTransitionState(stateName, callback) {
    var _a, _b, _c;
    if (process.env.NODE_ENV !== 'production') {
        // Only validate the stateName if the caller provides one.
        if (stateName && !TransitionStateNames.includes(stateName)) {
            throw new Error(`Invalid state name '${stateName}'`);
        }
    }
    // Remove all specific transition callbacks.
    if (!callback && stateName) {
        (_a = TransitionCache.get(stateName)) === null || _a === void 0 ? void 0 : _a.clear();
    }
    // Remove a single distinct transition callback.
    else if (stateName && callback) {
        (_b = TransitionCache.get(stateName)) === null || _b === void 0 ? void 0 : _b.delete(callback);
    }
    // Remove all transition callbacks.
    else {
        for (let i = 0; i < TransitionStateNames.length; i++) {
            (_c = TransitionCache.get(TransitionStateNames[i])) === null || _c === void 0 ? void 0 : _c.clear();
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
export function runTransitions(setName, ...args) {
    const set = TransitionCache.get(setName);
    /** @type {Promise<any>[]} */
    const promises = [];
    if (!set) {
        return promises;
    }
    const [vTree, ...rest] = args;
    // Filter out text nodes and fragments from transition callbacks.
    if (!set.size || (setName !== 'textChanged' && vTree.nodeType !== 1)) {
        return promises;
    }
    // Run each transition callback, but only if the passed args are an
    // Element.
    set.forEach(callback => {
        const retVal = callback(NodeCache.get(vTree), ...rest);
        // Is a `thennable` object or Native Promise.
        if (typeof retVal === 'object' && retVal.then) {
            promises.push(retVal);
        }
    });
    // For attached and detached transitions, dig into children to ensure
    // all are run with this.
    if (setName === 'attached' || setName === 'detached') {
        vTree.childNodes.forEach((/** @type {VTree} */ childTree) => {
            promises.push(...runTransitions(setName, childTree, ...rest));
        });
    }
    return promises;
}
