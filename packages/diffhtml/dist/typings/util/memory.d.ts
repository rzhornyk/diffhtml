/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param {VTree} vTree
 * @return vTree
 */
export function protectVTree(vTree: VTree): VTree;
/**
 * Recyles a VTree by deallocating, removing its DOM Node reference, and
 * recursively applying to all nested children.
 *
 * @param {VTree} vTree
 * @return
 */
export function unprotectVTree(vTree: VTree): VTree;
/**
 * Collects any unused VTree's and puts them back into the free Set. This is
 * primarily used by tests, but could also be useful for specific niche cases
 * as a way to ease memory/CPU pressure when lots of temporary trees are
 * created but never used.
 */
export function gc(): void;
import { VTree } from "./types";
