"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

var _caches = require("./util/caches");

var _process = _interopRequireDefault(require("./util/process"));

var _types = require("./util/types");

var _internals = _interopRequireDefault(require("./util/internals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isArray
} = Array;
/**
 * Hook functions into the transaction task stack. When a function is passed it
 * will be called before any synchronization or patching has occured. When a
 * nested function is returned from that function it will be injected after
 * patching. From there code can add to the Transaction#onceEnded callbacks and
 * know exactly when a transaction has fully completed.
 *
 * These functions can, and should, the properties which can also be directly
 * passed as an object.
 *
 * - displayName - Optional, but a good idea to identify in DevTools
 *
 * - subscribe - Whenever a middleware is activated this is called with the
 *   sole argument being the diff.Internals API.
 *
 * - unsubscribe - Whenever a middleware is unsubscribed, ensure you fully clean
 *   up after it.
 *
 * - createTreeHook - Whenever a VTree is created, this hook is called.
 *
 * - createNodeHook - Whenever a DOM node is created, this hook is called.
 *
 * - syncTreeHook - Whenever two VTrees are diffed this hook is called.
 *
 * - releaseHook - Whenever a VTree/DOM node binding has been released this is
 *   called.
 *
 * @param {Middleware} middleware
 */

function use(middleware) {
  const isFunction = typeof middleware === 'function';
  const isObject = typeof middleware === 'object';

  if (_process.default.env.NODE_ENV !== 'production') {
    if (!middleware || !isFunction && !isObject || isArray(middleware)) {
      throw new Error('Middleware must be a function or plain object');
    }
  }

  const {
    subscribe,
    unsubscribe,
    createTreeHook,
    createNodeHook,
    syncTreeHook,
    releaseHook,
    parseHook
  } = middleware; // Add the function to the set of middlewares.

  isFunction && _caches.MiddlewareCache.add(
  /** @type {Function} */
  middleware); // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.

  subscribe && subscribe(_internals.default); // Add the hyper-specific create hooks.

  createTreeHook && _caches.CreateTreeHookCache.add(createTreeHook);
  createNodeHook && _caches.CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && _caches.SyncTreeHookCache.add(syncTreeHook);
  releaseHook && _caches.ReleaseHookCache.add(releaseHook);
  parseHook && _caches.ParseHookCache.add(parseHook); // The unsubscribe method for the middleware.

  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    isFunction && _caches.MiddlewareCache.delete(
    /** @type {Function} */
    middleware); // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).

    unsubscribe && unsubscribe(_internals.default); // Cleanup the specific fns from their Cache.

    createTreeHook && _caches.CreateTreeHookCache.delete(createTreeHook);
    createNodeHook && _caches.CreateNodeHookCache.delete(createNodeHook);
    syncTreeHook && _caches.SyncTreeHookCache.delete(syncTreeHook);
    releaseHook && _caches.ReleaseHookCache.delete(releaseHook);
    parseHook && _caches.ParseHookCache.delete(parseHook);
  };
}

module.exports = exports.default;