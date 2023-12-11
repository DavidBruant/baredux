//@ts-check

import Store from './main.js'

import Store2 from 'baredux'

{
    const s1 = Store({
        state: {x: 1},
        mutations: {
            increment(state){
                state.x = state.x+1;
            },
            /**
             * @param {number} y 
             */
            add(state, y){
                state.x = state.x + y;
            },
            err(state){
                console.log(state.z)
            },
            /**
             * 
             * @param {string} state 
             */
            err2(state){ }
        }
    })

    const x = s1.state.x
    console.log(x)

    const increment = s1.mutations.increment
    increment()

    const add = s1.mutations.add
    add(37)
}

{
    const s2 = Store2({
        state: {x: 1},
        mutations: {
            increment(state){
                state.x = state.x+1;
            },
            /**
             * @param {number} y 
             */
            add(state, y){
                state.x = state.x + y;
            },
            err(state){
                console.log(state.z)
            },
            /**
             * 
             * @param {string} state 
             */
            err2(state){ }
        }
    })

    const x = s2.state.x
    console.log(x)

    const increment = s2.mutations.increment
    increment()

    const add = s2.mutations.add
    add(37)
}

/**
 * 
 * @param {number} x 
 * @returns {number}
 */
function f(x){ return 1 }

/**
 * 
 * @param {number} x 
 * @param {boolean} y 
 * @returns {number}
 */
function f2(x, y){ return 2 }

/**
 * @typedef {import('./types.js').OmitFirstArg<f>} F1
 * @typedef {import('./types.js').OmitFirstArg<f2>} F2
 */


const obj = {
    method(x){return undefined},
    method2(x, y){return undefined},
    method3(x, y, z){return undefined}
};

/**
 * @typedef {import('./types.js').BareduxOutputMutations<obj>} Obj1
 */


/**
 * @typedef { {s: string} } FakeState
 */


function sameFunctionWithoutFirstArg(f){
    return (...args) => {
        return f(undefined, ...args)
    }
}

/**
 * @template { import('./types.js').BareduxInputMutations<FakeState> } InputMutations
 * @param {InputMutations} inputMutations 
 * @returns {import('./types.js').BareduxOutputMutations<InputMutations>}
 */
function toOutputMutations(inputMutations){
    /** @type {import('./types.js').BareduxOutputMutations<InputMutations>} */
    const obj = {}

    for(const key of Object.keys(inputMutations)){
        obj[key] = sameFunctionWithoutFirstArg(inputMutations[key])
    }

    return obj
}

const outputObj = toOutputMutations(obj)

outputObj.method
outputObj.method2