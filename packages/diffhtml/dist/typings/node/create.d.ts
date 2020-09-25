/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {VTreeLike} vTreeLike - A Virtual Tree Element or VTree-like element
 * @param {Document=} ownerDocument - Document to create Nodes in, defaults to document
 * @param {Boolean=} isSVG - Indicates if the root element is SVG
 * @return {ValidNode | null} A DOM Node matching the vTree
 */
export default function createNode(vTreeLike: VTreeLike, ownerDocument?: Document | undefined, isSVG?: boolean | undefined): ValidNode | null;
import { VTreeLike } from "../util/types";
import { ValidNode } from "../util/types";
