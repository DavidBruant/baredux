# baredux

A simple JavaScript state management library

the ideas behind baredux are heavily influenced by [redux](http://redux.js.org/), [Vuex](http://vuex.vuejs.org/) and [Rematch](https://github.com/rematch/rematch), so if you're familiar with any of these, baredux should be easy to understand

if you're new to JavaScript state management: welcome :-)\
this library should be a simpler first step than any of the 3 libraries mentionned above


## Install

**In your JavaScript project:**

`npm install github:DavidBruant/baredux#v1.0.4`

**Directly in the browser**

```js
import Store from 'https://cdn.jsdelivr.net/gh/DavidBruant/baredux@v1.0.4/main.js'

const store = new Store({state: {}, mutations: {}})
```


## Basic usage

This library enables the creation of a **store**\
a **store** contains a **state** and **mutations**\
the **state** is data represented as JavaScript objects\
**mutations** are functions and should be the only way to modify the **state**\
**mutations** must be synchronous\
it is also possible to **subscribe** to the store to be told whenever the state has changed

That's all you need to know to get started :-)

```js
const store = new Store({
    state: {
        count: 0
    }, 
    mutations: {
        increase(state, supplement){
            state.count += supplement
        }
    }
})

const {state, mutations, subscribe} = store;

console.log(state.count) // 0

mutations.increase(2)

console.log(state.count) // 2

subscribe(state => {
    console.log(state.count)
})

mutations.increase(1)
// the subscriber logs 3 
```


### Connection with [React](http://reactjs.org/)

(but like, also [preact](https://preactjs.com/)!)

```js
import {render} from 'react-dom'
import {createElement} from 'react'
import Store from 'baredux'

import TodoList from './components/TodoList'

// define the store
const store = new Store({
    state: {
        viewFilter: 'ONLY_COMPLETED',
        todos: new Set([
            {
                label: 'water plants',
                completed: true
            },
            {
                label: 'buy rice',
                completed: false
            }
        ])
    },
    mutations: {
        addTodo(state, todo){
            state.todos.add(todo)
        },
        setViewFilter(state, viewFilter){
            state.viewFilter = viewFilter
        }
    }
})

// subscribe to store to re-render after every state change
store.subscribe(state => {
    const {addTodo, setViewFilter} = store.mutations
    const {todos, viewFilter} = state

    render(
        createElement(TodoList, {todos, viewFilter, addTodo, setViewFilter}),
        document.querySelector('#react-container')
    )
})

```

## Advanced topics

### Design decisions

**subscribers are called after a mutation function is called**

They are not called when the state data changes; the state data is not "watched"

The subscribers are called regardless of whether the call to the mutation function actually mutated the state\
The rationale is that the mutation function caller has access to the state and knows which mutuation they want to perform, so if they called the function, it is assumed they actually wanted to perform a mutation


**subscribers called once even if several synchronous mutations happened**

There can be cases where several mutations happen within the same [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/), however, in these cases, we wouldn't want several re-renders

For this reason, subscribers are scheduled to be called after the current [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)


**the library does not enforce that the state is readonly**

Getting the state from `store.state` or via a subscriber callback does not guarantee the state will be read-only. As a matter of fact, although it's not in the spirit of this library, you can mutate it directly

This is by design to keep the library simple

A section below discusses how to enforce readonly


**two possible styles of mutations**

```js
const store = new Store({
    state: { count: 0 },
    mutations: {
        // direct mutation 
        increaseCount1(state){
            state.count = state.count + 1
        }
        // replace state
        increaseCount2(state){
            return {
                count = state.count + 1
            }
        }
    }
})
```

Both styles are possible and are distinguished by whether the mutation function returns `undefined` or something else


### Asynchronous operations

This library does not have a notion of `async action` from redux, `action` from Vuex or `effect` from rematch. It's just *functions* built on top of the store `mutations`

```js
// defining the store
const store = new Store({
    state: {
        todos: {
            pending: undefined,
            value: [],
            error: undefined
        }
    },
    mutations: {
        todos: {
            setPending(state, pending){
                return {
                    todos: { pending, value: undefined, error: undefined }
                }
            },
            setValue(state, value){
                return {
                    todos: { pending: undefined, value, error: undefined }
                }
            },
            setError(state, error){
                return {
                    todos: { pending: undefined, value: undefined, error }
                }
            }
        }
    }
})

// defining a function that mutates the state via mutations
function fetchTodos(){
    const {setPending, setValue, setError} = store.mutations.todos
    
    setPending(true)
    
    fetch('/todos').then(r => r.json())
        .then(setValue)
        .catch(setError)
}
// alternatively to `fetchTodos` having static access to the store, it's possible to pass `store` as argument
// ... or `store.mutations`... or `store.mutations.todos` directly since that's the only thing it needs

```


### Actual read-only state

By design, this library does not provide the guarantee that the state is read-only

You can get this guarantee yourself via one of two ways:
- define the state as an immutable data structure using a library like [immutable.js](https://immutable-js.github.io/immutable-js/)
- create [TypeScript](http://typescriptlang.org/) definitions that define the state from this library as deeply readonly. [Example](https://www.typescriptlang.org/play/#src=%2F%2F%20adapted%20from%20https%3A%2F%2Fgithub.com%2FMicrosoft%2FTypeScript%2Fpull%2F21316%23issue-164138025%0D%0A%0D%0Atype%20DeepReadonly%3CT%3E%20%3D%0D%0A%20%20%20%20T%20extends%20any[]%20%3F%20DeepReadonlyArray%3CT[number]%3E%20%3A%0D%0A%20%20%20%20T%20extends%20object%20%3F%20DeepReadonlyObject%3CT%3E%20%3A%0D%0A%20%20%20%20T%3B%0D%0A%0D%0Ainterface%20DeepReadonlyArray%3CT%3E%20extends%20ReadonlyArray%3CDeepReadonly%3CT%3E%3E%20{}%0D%0A%0D%0Atype%20DeepReadonlyObject%3CT%3E%20%3D%20{%0D%0A%20%20%20%20readonly%20[P%20in%20NonFunctionPropertyNames%3CT%3E]%3A%20DeepReadonly%3CT[P]%3E%3B%0D%0A}%3B%0D%0A%0D%0Atype%20NonFunctionPropertyNames%3CT%3E%20%3D%20{%20[K%20in%20keyof%20T]%3A%20T[K]%20extends%20Function%20%3F%20never%20%3A%20K%20}[keyof%20T]%3B%0D%0A%0D%0Aclass%20Part{%0D%0A%20%20%20%20id%20%3D%200%0D%0A%20%20%20%20name%20%3D%20'yo'%0D%0A%20%20%20%20subparts%20%3D%20[%0D%0A%20%20%20%20%20%20%20%20{id%3A%201}%2C%0D%0A%20%20%20%20%20%20%20%20{id%3A%202}%0D%0A%20%20%20%20]%0D%0A}%0D%0A%0D%0Afunction%20f10(part%3A%20DeepReadonly%3CPart%3E)%20{%0D%0A%20%20%20%20let%20name%20%3D%20part.name%3B%0D%0A%20%20%20%20let%20id%20%3D%20part.subparts[0].id%3B%0D%0A%0D%0A%20%20%20%20part.id%20%3D%20part.id%3B%20%20%2F%2F%20Error%0D%0A%20%20%20%20part.subparts[0]%20%3D%20part.subparts[0]%3B%20%20%2F%2F%20Error%0D%0A%20%20%20%20part.subparts[0].id%20%3D%20part.subparts[0].id%3B%20%20%2F%2F%20Error%0D%0A}%0D%0A)

Maybe, at a future time, [i'll provide this TypeScript definition](https://github.com/DavidBruant/baredux/issues/2)


### Deep mutation definition

Mutations can be "namespaced"

```js
const store = new Store({
    state: {
        count: 0,
        todos: new Set()
    },
    mutations: {
        increaseCount(state){
            state.count += 1
        },
        s: {
            e: {
                v:{
                    e:{
                        n(state){
                            state.count = 7
                        }
                    }
                }
            }
        }
        todos: {
            add(state, todo){
                state.todos.add(todo)
            },
            clear(state){
                state.todos = new Set()
            }
        }
    }
})

store.mutations.increaseCount()
store.mutations.s.e.v.e.n()
store.mutations.todos.add({label: 'listen to Radio Meuh'})
store.mutations.todos.clear()
```


### Richer React/preact integration

(soon) à la react-redux with context

### Adding mutations dynamically

This can be useful when [import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports)ing code dynamically

```js
const baseMutations = {
    increaseCount(state){
        state.count += 1
    }
}

const store = new Store({
    state: {
        count: 0
    }, 
    mutations: baseMutations
})

console.log(store.state.count) // 0

store.mutations.increase()
store.mutations.increase()

console.log(store.state.count) // 2

baseMutations.decreaseCount = function(state){
    state.count -= 1
}

store.mutations.decrease() // wait what?

console.log(store.state.count) // 1
// WHOA!! Magic!
```

### The store is an event emitter

[(soon)](https://github.com/DavidBruant/baredux/issues/3)

### Comparison with redux

(soon)

### Comparison with Vuex

(soon)




## Motivation

(a bit drafty right now, i'll rewrite soon)

https://redux.js.org/introduction/three-principles
https://redux.js.org/introduction/motivation

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

## Browser support

modern browsers


## Licence

Creative Commons Zero
