import syncTree from '../tree/sync';

export default function sync(transaction) {
  const { state: { oldTree, newTree } } = transaction;
  performance.mark('sync');

  transaction.patches = syncTree(oldTree, newTree);

  performance.mark('sync end');
  performance.measure('diffHTML render sync', 'sync', 'sync end');

  return transaction;
}
