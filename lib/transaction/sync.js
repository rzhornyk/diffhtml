import syncTree from '../tree/sync';

export default function sync(transaction) {
  const { state: { mark, oldTree, newTree } } = transaction;

  mark('sync');
  transaction.patches = syncTree(oldTree, newTree);
  mark('sync');

  return transaction;
}
