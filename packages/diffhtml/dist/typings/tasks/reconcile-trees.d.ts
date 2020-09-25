/**
 * This task ensures that the Virtual DOM matches the Browser DOM. If any of the
 * markup changes between renders, the old tree is recalculated to ensure accuracy.
 *
 * @param {Transaction} transaction
 */
export default function reconcileTrees(transaction: Transaction): void;
import Transaction from "../transaction";
