import { StateCache } from './util/cache';
import { cleanMemory } from './util/memory';
import { mark } from './util/performance';
import schedule from './transaction/schedule';
import shouldUpdate from './transaction/should-update';
import reconcileTrees from './transaction/reconcile-trees';
import start from './transaction/start';
import sync from './transaction/sync';
import patch from './transaction/patch';
import endAsPromise from './transaction/end-as-promise';

export default class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

  static renderNext(state) {
    const { nextTransaction: { domNode, markup, options } } = state;
    state.nextTransaction = undefined;
    Transaction.create(domNode, markup, options).start();
  }

  static flow(init, fns) {
    return () => fns.reduce((ret, fn) => (ret === undefined || ret === init) ? fn(init) : ret, init);
  }

  constructor(domNode, markup, options) {
    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = StateCache.get(domNode) || { mark };

    this._flowTasks = Object.assign([], [
      schedule,
      shouldUpdate,
      reconcileTrees,
      start,
      sync,
      patch,
      endAsPromise,
    ], options.flow);

    this.flow = Transaction.flow(this, this.flowTasks);

    StateCache.set(domNode, this.state);
  }

  start() {
    this.state.mark('render');
    return this.flow();
  }

  // This will immediately call the last flow task and terminate the flow. We
  // call the last task to ensure that the control flow completes.
  abort() {
    state.mark('finalize');
    state.mark('render');

    return this._flowTasks.slice(-1)[0](this);
  }

  end() {
    const { state, domNode, options } = this;
    const { inner } = options;

    state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
    state.previousText = domNode.textContent;
    state.isRendering = false;

    // This is designed to handle use cases where renders are being hammered
    // or when transitions are used with Promises. If this element has a next
    // render state, trigger it first as priority.
    if (state.nextTransaction) {
      Transaction.renderNext(state);
    }
    // Otherwise dig into the other states and pick off the first one
    // available.
    else {
      for (const state of StateCache.entries()) {
        if (state.nextTransaction) {
          Transaction.renderNext(state);
          break;
        }
      }
    }

    // Clean out all the existing allocations.
    cleanMemory();

    state.mark('finalize');
    state.mark('render');
  }
}
