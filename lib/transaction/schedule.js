import { StateCache } from '../util/cache';

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
export default function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  const { state } = transaction;

  // Cancel any previously buffered transactions.
  state.nextTransaction = null;

  // Look up all existing states for any rendering, and set the next render
  // buffer if blocked. We'll key off the `nextTransaction` value to determine
  // if we've set a new transaction.
  StateCache.forEach(cachedState => {
    if (cachedState.isRendering) {
      state.nextTransaction = transaction;
    }
  });

  // Determine if a transaction was scheduled by inferring the
  // `nextTransaction` property.
  const transactionWasScheduled = Boolean(state.nextTransaction);

  // If we scheduled this transaction in the future, cancel the transaction
  // flow, by returning an explicit `false` value.
  if (transactionWasScheduled) {
    transaction.abort();
  }
}
