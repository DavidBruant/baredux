//@ts-check

import Store from './main.js'

{
    const s1 = Store({
        state: {x: 1},
        mutations: {
            increment(state){
                state.x = state.x+1;
            }
        }
    })

    const x = s1.state.x
    console.log(x)

    const increment = s1.mutations.increment

    increment()
}