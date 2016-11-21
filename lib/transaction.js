import { StateCache } from './util/cache';
import schedule from './transaction/schedule';
import shouldUpdate from './transaction/should-update';
import reconcileTrees from './transaction/reconcile-trees';
import start from './transaction/start';
import sync from './transaction/sync';
import patch from './transaction/patch';
import finalize from './transaction/finalize';

export default class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

  static flow(initial, fns) {
    return () => fns.reduce((ret, fn) => ret !== false && fn(ret), initial);
  }

  constructor(domNode, markup, options) {
    this.domNode = domNode;
    this.markup = markup;
    this.options = options;
    this.state = StateCache.get(domNode) || {};

    this.flow = Transaction.flow(this, [
      schedule,
      shouldUpdate,
      reconcileTrees,
      start,
      sync,
    ]);

    StateCache.set(domNode, this.state);
  }

  start() {
    performance.mark('start');

    // Flow the initial actions.
    const shouldUpdate = this.flow();

    if (shouldUpdate) {
      performance.mark('patch');

      patch(this);

      performance.mark('patch end');
      performance.measure('diffHTML render patch', 'patch', 'patch end');
    }

    performance.mark('finalize');

    return finalize(this);
  }
}
