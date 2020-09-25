/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {Supplemental=} supplemental - Dynamic interpolated data values
 * @param {Options=} options - Contains options like silencing warnings
 * @return {VTree} - Parsed Virtual Tree Element
 */
export default function parse(html: string, supplemental?: Supplemental | undefined, options?: Options | undefined): VTree;
export const TOKEN: "__DIFFHTML__";
import { Supplemental } from "./types";
import { Options } from "./types";
import { VTree } from "./types";
