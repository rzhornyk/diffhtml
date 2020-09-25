export const defaultTasks: (typeof syncTrees)[];
export namespace tasks {
    export { schedule };
    export { shouldUpdate };
    export { reconcileTrees };
    export { syncTrees };
    export { patchNode };
    export { endAsPromise };
}
export default class Transaction {
    /**
     *
     * @param {Mount} domNode
     * @param {ValidInput} input
     * @param {*} options
     */
    static create(domNode: Mount, input: ValidInput, options: any): Transaction;
    /**
     * @param {Transaction} transaction
     * @param {any} tasks
     *
     * @return {Promise<Transaction> | unknown}
     */
    static flow(transaction: Transaction, tasks: any): Promise<Transaction> | unknown;
    /**
     *
     * @param {Transaction} transaction
     */
    static assert(transaction: Transaction): void;
    /**
     *
     * @param {Transaction} transaction
     */
    static invokeMiddleware(transaction: Transaction): void;
    /**
     * @constructor
     * @param {Mount} domNode
     * @param {ValidInput} input
     * @param {Options} options
     */
    constructor(domNode: Mount, input: ValidInput, options: Options);
    /** @type {Mount} */
    domNode: Mount;
    /** @type {ValidInput} */
    markup: ValidInput;
    options: Options;
    /** @type {TransactionState} */
    state: TransactionState;
    /** @type {Function[]} */
    tasks: Function[];
    endedCallbacks: Set<any>;
    /**
     * @return {Promise<Transaction> | unknown}
     */
    start(): Promise<Transaction> | unknown;
    aborted: boolean | undefined;
    /**
     * This will immediately call the last flow task and terminate the flow. We
     * call the last task to ensure that the control flow completes. This should
     * end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
     * `return someValue` to provide the most accurate performance reading. This
     * doesn't matter practically besides that.
     *
     * @param {boolean=} isReturn
     */
    abort(isReturn?: boolean | undefined): any;
    /**
     * @return {Transaction}
     */
    end(): Transaction;
    completed: boolean | undefined;
    /**
     * @param {Function} callback
     */
    onceEnded(callback: Function): void;
    /** @type {VTree=} */
    oldTree: VTree | undefined;
    /** @type {VTree=} */
    newTree: VTree | undefined;
    /** @type {Promise<any>=} */
    promise: Promise<any> | undefined;
    /** @type {Promise<any>[]=} */
    promises: Promise<any>[] | undefined;
    /** @type any */
    patches: any;
}
import syncTrees from "./tasks/sync-trees";
import schedule from "./tasks/schedule";
import shouldUpdate from "./tasks/should-update";
import reconcileTrees from "./tasks/reconcile-trees";
import patchNode from "./tasks/patch-node";
import endAsPromise from "./tasks/end-as-promise";
import { Mount } from "./util/types";
import { ValidInput } from "./util/types";
import { Options } from "./util/types";
import { TransactionState } from "./util/types";
import { VTree } from "./util/types";
