//@ts-check

import Store from './main.js'

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
            }
        }
    })

    const x = s1.state.x
    console.log(x)

    const increment = s1.mutations.increment
    increment()

    const add = s1.mutations.add
    add(37)
}