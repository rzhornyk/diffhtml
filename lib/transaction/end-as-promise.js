import Transaction from '../transaction';

export default function endAsPromise(transaction) {
  const { state, domNode, promises=[] } = transaction;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return Promise.all(promises).then(
      () => transaction.end(/*postPatchMiddlewares*/)
    );
  }
  else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end(/*postPatchMiddlewares*/));
  }
}
