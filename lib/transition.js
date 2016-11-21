//// A list of possible transition states.
//const stateNames = [
//  'attached',
//  'detached',
//  'replaced',
//  'attributeChanged',
//  'textChanged',
//];
//
//// Build a cache map of state names to an array.
//const states = stateNames.reduce((o, name) => ({ ...o,  { [name]: [] }), {});
//
//export default class Transition {
//  static create() {
//
//  }
//
//  constructor(stateName, childNodes) {
//    this.states = {
//
//    };
//  }
//
//  trigger(callback) {
//    return this;
//  }
//}
//
//// Transition.create('detached', childNodes).trigger(() => {
////
//// });
//
export function addTransitionState(state, callback) {
  if (!state) {
    throw new Error('Missing transition state name');
  }

  if (!callback) {
    throw new Error('Missing transition state callback');
  }

  // Not a valid state name.
  if (stateNames.indexOf(state) === -1) {
    throw new Error('Invalid state name: ' + state);
  }

  states[state].push(callback);
}

export function removeTransitionState(state, callback) {
  if (!callback && state) {
    states[state].length = 0;
  }
  else if (state && callback) {
    // Not a valid state name.
    if (stateNames.indexOf(state) === -1) {
      throw new Error('Invalid state name ' + state);
    }

    states[state].splice(states[state].indexOf(callback), 1);
  }
  else {
    for (const state in states) {
      states[state].length = 0;
    }
  }
}
