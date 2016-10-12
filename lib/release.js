import { StateCache } from './util/cache';
import { cleanMemory, unprotectElement } from './util/memory';

/**
 * This releases the state associated with a DOM Node. Useful for cleaning up
 * after unit tests or component/view cleanup.
 *
 * @param domNode {Object} - DOM Node to lookup
 */
export default function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    unprotectElement(state.oldTree);
  }

  // Remove the Node's state object from the cache.
  StateCache.delete(domNode);

  // Recycle all unprotected objects.
  cleanMemory();
}
