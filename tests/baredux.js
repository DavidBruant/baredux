import {strict as assert} from 'assert'

import Store from '../main.js'

/*
    Open design decisions:
    - The store could be an event emitter and 'subscribe' be a shorthand for one specific event
*/


describe('baredux', () => {

    describe('Store constructor', () => {
        it('should be a function', () => {
            assert.equal(typeof Store, 'function')
        })

        it('should return an object with state, mutation and subscribe properties', () => {
            const store = new Store({state: {}, mutations: {}})

            assert.equal(Object(store), store)
            assert.equal(Object(store.state), store.state)
            assert.equal(Object(store.mutations), store.mutations)
            assert.equal(typeof store.subscribe, 'function')

        })

        it("should work the same without 'new'", () => {
            const store = Store({state: {}, mutations: {}})

            assert.equal(Object(store), store)
            assert.equal(Object(store.state), store.state)
            assert.equal(Object(store.mutations), store.mutations)
            assert.equal(typeof store.subscribe, 'function')
        })
    })

    describe('Initial state', () => {
        it('should be reflected', () => {
            const store = new Store({state: {a: 1}, mutations: {}})

            assert.equal(store.state.a, 1)
        })
    })

    describe('Mutations', () => {
        it('should mutate the state if the mutation function mutates the state argument', () => {
            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    setA(state){
                        state.a = 2;
                    }
                }
            })

            assert.equal(store.state.a, 1)
            
            store.mutations.setA()

            assert.equal(store.state.a, 2)
        })

        it('should replace the state if the mutation function returns', () => {
            const nextState = {}

            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    setA(state){
                        return Object.assign(nextState, state, {a: 2})
                    }
                }
            })

            assert.equal(store.state.a, 1)
            
            store.mutations.setA()

            assert.equal(store.state, nextState)
            assert.equal(store.state.a, 2)
        })

        it('should be definable deeply', () => {
            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    abra: {
                        kadabra: {
                            alakazam(state){
                                state.a = 'a';
                            }
                        }
                    }
                }
            })

            assert.equal(store.state.a, 1)
            
            store.mutations.abra.kadabra.alakazam()

            assert.equal(store.state.a, 'a')
        })

    })

    describe('Mutation functions', () => {

        // detachability is a useful feature to pass functions down to react/preact components for instance
        it('should be detachable', () => {
            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    setA(state){
                        state.a = 2;
                    }
                }
            })

            const setA = store.mutations.setA
            
            setA()

            assert.equal(store.state.a, 2)
        })
    })

    describe('Mutations with payload', () => {
        it('should pass it', () => {
            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    setA(state, a){
                        state.a = a;
                    }
                }
            })

            assert.equal(store.state.a, 1)
            
            store.mutations.setA(37)

            assert.equal(store.state.a, 37)
        })
    })

    describe('store subscriptions', () => {
        it('react to mutations', () => {

            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    setA(state, a){
                        state.a = a;
                    }
                }
            })
            
            return new Promise(resolve => {
                store.subscribe(state => {
                    assert.equal(state.a, 25)
                    resolve()
                })
    
                store.mutations.setA(25)
            })

        })

        it('should react to mutations deeply defined', () => {
            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    abra: {
                        kadabra: {
                            alakazam(state){
                                state.a = 'a';
                            }
                        }
                    }
                }
            })
            
            return new Promise(resolve => {
                store.subscribe(state => {
                    assert.equal(state.a, 'a')
                    resolve()
                })
    
                store.mutations.abra.kadabra.alakazam()
            })
        })

        it('returns an unsubscribe function', () => {
            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    setA(state, a){
                        state.a = a;
                    }
                }
            })
            
            const unsubscribe = store.subscribe(state => {
                assert.fail('unsubscribed subscriber should not be called')
            })

            unsubscribe()

            store.mutations.setA(25)

            return new Promise(resolve => setTimeout(resolve, 50))
        })

        it('should react once to multiple synchronous mutations', () => {
            const store = new Store({
                state: {a: 1}, 
                mutations: {
                    setA(state, a){
                        state.a = a;
                    }
                }
            })

            let callsCount = 0;
            
            const unsubscribe = store.subscribe(state => {
                callsCount += 1;
            })

            store.mutations.setA(2)
            store.mutations.setA(3)
            store.mutations.setA(4)

            return new Promise(resolve => setTimeout(() => {
                assert.equal(store.state.a, 4)
                assert.equal(callsCount, 1)
                resolve()
            }, 50))
        })
    })

})