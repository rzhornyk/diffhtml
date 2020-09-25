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
export default function use(middleware: Middleware): () => void;
import { Middleware } from "./util/types";
