/**
 * Typically passed either a single or list of DOM Nodes or a VTreeLike object.
 *
 * @param {ValidInput=} input
 * @param {any=} attributes
 * @param {any=} childNodes
 * @param  {...any} rest
 *
 * @return {VTree}
 */
export default function createTree(input?: ValidInput | undefined, attributes?: any | undefined, childNodes?: any | undefined, ...rest: any[]): VTree;
import { ValidInput } from "../util/types";
import { VTree } from "../util/types";
