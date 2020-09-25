/**
 *
 * @param {TransitionStateName} stateName
 * @param {Function} callback
 * @return {void}
 */
export function addTransitionState(stateName: TransitionStateName, callback: Function): void;
/**
 *
 * @param {TransitionStateName=} stateName
 * @param {Function=} callback
 * @return {void}
 */
export function removeTransitionState(stateName?: TransitionStateName | undefined, callback?: Function | undefined): void;
/**
 *
 * @param {TransitionStateName} setName
 * @param  {...any} args
 *
 * @return {Promise<any>[]}
 */
export function runTransitions(setName: TransitionStateName, ...args: any[]): Promise<any>[];
import { TransitionStateName } from "./util/types";
