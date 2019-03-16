# baredux

i find the concept behind Flux/redux good, but i'm disatisfied with the API ergonomics of redux\
Among the annoyances:
- Action constants list
- compulsory switch/case over the action constants
- redux-thunk is very quickly necessary to deal with async actions (fetch) while not being available out of the box

i find react-redux overly complicated. Things i dislike:
- Provider as non-visual higher-order component

i have experience with Vuex and was interested in rematch, so this repo is clearly inspired by these

From Vuex, i enjoyed the notions of mutations/actions (which are named respectively reducers/effects in rematch). I didn't enjoy:
- `store.commit('addTodo', {label: 'Yo!', done: false})`
    - i prefer rematch's `dispatch.todo.add({label: 'Yo!', done: false})`
- `subscribe` shares the last action description (i usually only need the state)

The concepts i want:
- store
- state
- mutation
- subscription (for re-renders)

Anything else is on top of these

Ideally, the state would be defensive by default, that is only mutations should be able to mutate it directly. Anything else with access to it should only have a read-only version of it

Mutation/actions should be importable for other modules

The state of a store is data, the 





```js
// store.js

// this function adds a `state` getter and a subscribe function
import {createStore} from 'boredaux'

export default createStore({
    state: {
        loading: false,
        todos: [
            {
                label: 'water plants',
                done: true
            },
            {
                label: 'buy rice',
                done: false
            }
        ]
    },
    mutations: {
        todos: {
            add(state, todo){
                state.todos.add(todo)
            }
        },
        setLoading(state, l){
            state.loading = l
        }
    }
})
```

```js
// main.js

import {render, h} from 'preact'
import store from './store.js'

store.state;
store.state.todos;

store.mutations.todos.add({
    label: 'watch Jessica Jones Season 3',
    done: false
})

store.subscribe(state => {
    render(
        h(Main, state), 
        document.querySelector('#container')
    )
})

/*
    actions: {
        getServerTodos(){
            store.mutations.setLoading(true)
            
            fetch('./todos')
                .then(todos => { for(const todo of todos) store.mutations.todos.add(todo) })
                .finally(() => store.mutations.setLoading(false))
        }
    }
    
*/

```




Importing a mutation

```js
// store.js


```

## Read-only state

## async operations

## Connection with react/preact



## Browser support

modern browsers
Maybe i'll do an IE11-compatible version if i need one