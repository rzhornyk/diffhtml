/**
 * Processes a tagged template, or process a string and interpolate
 * associated values. These values can be of any type and can be
 * put in various parts of the markup, such as tag names, attributes,
 * and node values.
 *
 * @param {string | string[] | TemplateStringsArray} strings
 * @param  {...any} values - test
 * @return {VTree} VTree object or null if no input strings
 */
declare function handleTaggedTemplate(strings: string | string[] | TemplateStringsArray, ...values: any[]): VTree;
declare namespace handleTaggedTemplate {
    export const isStrict: boolean;
    export { setStrictMode as strict };
}
export default handleTaggedTemplate;
import { VTree } from "./util/types";
/**
 * Use a strict mode similar to XHTML/JSX where tags must be properly closed
 * and malformed markup is treated as an error. The default is to silently fail
 * just like HTML.
 *
 * @param {string | string[] | TemplateStringsArray} markup
 * @param  {any[]} args
 */
declare function setStrictMode(markup: string | string[] | TemplateStringsArray, ...args: any[]): VTree;
