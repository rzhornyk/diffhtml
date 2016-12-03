import syncTree from '../tree/sync';

export default function sync(transaction) {
  const { state, state: { oldTree, newTree } } = transaction;

  state.mark('sync');
  transaction.patches = syncTree(oldTree, newTree);
  console.log(transaction.patches);
  //transaction.patches = [];
  state.mark('sync');

  return transaction;
}
