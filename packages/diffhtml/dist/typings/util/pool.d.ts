export default Pool;
declare namespace Pool {
    export { size };
    export { memory };
    /**
     * As the Pool size is configurable, this method can be used to fill up the
     * pool after making it larger.
     */
    export function fill(): void;
    /**
     * As the Pool size is configurable, this method can be used to fill up the
     * pool after making it larger.
     */
    export function fill(): void;
    /**
     * @return {VTree}
     */
    export function get(): VTree;
    /**
     * @return {VTree}
     */
    export function get(): VTree;
    /**
     * @param {VTree} vTree - Virtual Tree to protect
     */
    export function protect(vTree: VTree): void;
    /**
     * @param {VTree} vTree - Virtual Tree to protect
     */
    export function protect(vTree: VTree): void;
    /**
     * @param {VTree} vTree - Virtual Tree to unprotect and deallocate
     */
    export function unprotect(vTree: VTree): void;
    /**
     * @param {VTree} vTree - Virtual Tree to unprotect and deallocate
     */
    export function unprotect(vTree: VTree): void;
}
declare let size: number;
declare namespace memory {
    export { free };
    export { allocate as allocated };
    export { protect as protected };
}
import { VTree } from "./types";
declare const free: Set<any>;
declare const allocate: Set<any>;
declare const protect: Set<any>;
