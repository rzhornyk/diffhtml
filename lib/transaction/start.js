import { MiddlewareCache } from '../util/cache';

export default function start(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { oldTree } = state;

  // Mark the DOM Node state as rendering, this is used during the transaction
  // scheduling stage.
  state.isRendering = true;

  // Store all transaction starting middleware functions being executed here.
  //const startTransactionMiddlewares = [];

  //// Start off the middleware execution.
  //MiddlewareCache.forEach(executeMiddleware => {
  //  // Pass the start transaction call with the input arguments.
  //  const result = executeMiddleware({ domNode, markup, options });

  //  if (result) {
  //    startTransactionMiddlewares.push(result);
  //  }
  //});

  //// By exposing the internal tree synchronization and DOM Node patch methods,
  //// a middleware could implement sync/patch on a separate thread.
  //const transactionMethods = {
  //  syncTree,
  //  patchNode,
  //  protectElement,
  //  unprotectElement,
  //};

  //// Save the current transaction tree state and allow the mdidleware to
  //// override the trees.
  //const transactionState = {
  //  oldTree,
  //  newTree,
  //  transactionMethods,
  //};

  //// Trigger any middleware with the DOM Node, old Virtual Tree Element, and
  //// new Virtual Tree Element. This allows the middleware to mutate and inspect
  //// the trees before they get consumed by diffHTML.
  //const prePatchMiddlewares = [];

  //// Run each middleware and pass the transaction state which contains internal
  //// functions otherwise not available by the public API.
  //for (let i = 0; i < startTransactionMiddlewares.length; i++) {
  //  // Pass the the existing Virtual Tree Element, and the new Virtual Tree
  //  // Element. This is triggered before the synchronization and patching has
  //  // occured.
  //  const result = startTransactionMiddlewares[i](transactionState);

  //  if (result) {
  //    prePatchMiddlewares.push(result);
  //  }
  //}

  return transaction;
}
