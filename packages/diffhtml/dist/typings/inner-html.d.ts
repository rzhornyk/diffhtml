/**
 *
 * @param {Mount} domNode
 * @param {ValidInput} input
 * @param {Options} options
 *
 * @return {Promise<Transaction> | unknown}
 */
export default function innerHTML(domNode: Mount, input?: ValidInput, options?: Options): Promise<Transaction> | unknown;
import { Mount } from "./util/types";
import { ValidInput } from "./util/types";
import { Options } from "./util/types";
import Transaction from "./transaction";
