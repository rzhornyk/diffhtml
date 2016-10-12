import patchNode from '../node/patch';

export default function patch(transaction) {
  const { state, domNode, patches } = transaction;
  state.mark('patch');

  // Apply the set of patches to the Node.
  const promises = transaction.promises = patchNode(domNode, patches);

  // Trigger any middleware after syncing and patching the element. This is
  // mainly useful to get the Promises for something like devtools and patches
  // for something like logging.
  //const postPatchMiddlewares = [];

  //for (let i = 0; i < prePatchMiddlewares.length; i++) {
  //  // The DOM Node patching has finished and now we're sending the patchset
  //  // and the promises which can also be pushed into to do some asynchronous
  //  // behavior in a middleware.
  //  const result = prePatchMiddlewares[i]({
  //    patches,
  //    promises,
  //  });

  //  if (result) {
  //    postPatchMiddlewares.push(result);
  //  }
  //}
  state.mark('patch');
}
