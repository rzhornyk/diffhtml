/**
 * Compares how the new state should look to the old state and mutates it,
 * while recording the changes along the way.
 *
 * @param {Partial<VTree> | null} oldTree
 * @param {Partial<VTree> | null=} newTree
 * @param {any[]} patches
 * @param {Partial<TransactionState>} state
 * @param {boolean} attributesOnly
 *
 * @return {any[] | false | null}
 */
export default function syncTree(oldTree: Partial<VTree> | null, newTree?: (Partial<VTree> | null) | undefined, patches?: any[], state?: Partial<TransactionState>, attributesOnly?: boolean, ...args: any[]): any[] | false | null;
import { VTree } from "../util/types";
import { TransactionState } from "../util/types";
