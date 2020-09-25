/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Transaction} transaction
 * @return {Promise<Boolean> | void}
 */
export default function schedule(transaction: Transaction): Promise<boolean> | void;
import Transaction from "../transaction";
