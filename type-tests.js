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
    const s1 = Store2({
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