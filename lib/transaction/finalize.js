import Transaction from '../transaction';
import { StateCache } from '../util/cache';
import { cleanMemory } from '../util/memory';

/**
 * Pulls the next render object (containing the respective arguments to
 * patchNode) and invokes the next transaction.
 *
 * @param state
 */
const renderNextTransaction = state => {
  const { nextTransaction: { domNode, markup, options } } = state;
  state.nextTransaction = undefined;
  Transaction.create(domNode, markup, options);
};

/**
 * Returns a callback that finalizes the transaction, setting the isRendering
 * flag to false. This allows us to pick off and invoke the next available
 * transaction to render. This code recyles the unprotected allocated pool
 * objects and triggers a `renderComplete` event.
 *
 * @return {Function} - Closure that when called completes the transaction
 */
const getFinalizeCallback = transaction => (remainingMiddleware = []) => {
  const { state, domNode, options } = transaction;
  const { inner } = options;

  state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
  state.previousText = domNode.textContent;
  state.isRendering = false;

  // This is designed to handle use cases where renders are being hammered
  // or when transitions are used with Promises. If this element has a next
  // render state, trigger it first as priority.
  if (state.nextTransaction) {
    renderNextTransaction(state);
  }
  // Otherwise dig into the other states and pick off the first one
  // available.
  else {
    for (let state of StateCache.entries()) {
      if (state.nextTransaction) {
        renderNextTransaction(state);
        break;
      }
    }
  }

  // Clean out all the existing allocations.
  cleanMemory();

  performance.mark('finalize end');
  performance.measure('diffHTML render finalize', 'finalize', 'finalize end');
  performance.measure('diffHTML render', 'start', 'finalize end');

  // Call the remaining middleware signaling the render is complete.
  //for (let i=0; i < remainingMiddleware.length; i++) {
  //  remainingMiddleware[i]();
  //}
};

export default function finalize(transaction) {
  const { state, domNode, promises=[] } = transaction;

  // Clean up and finalize this transaction. If there is another transaction,
  // get a callback to run once this completes to run it.
  const finalizeTransaction = getFinalizeCallback(transaction);

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return Promise.all(promises).then(
      () => finalizeTransaction(/*postPatchMiddlewares*/)
    );
  }
  else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(finalizeTransaction(/*postPatchMiddlewares*/));
  }
}
