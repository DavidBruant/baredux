//@ts-check

/**
 * @template State
 * @template {import("./types").BareduxInputMutations<State>} Mutations
 * @param { {state: State, mutations: Mutations} } _
 * @returns {import("./types").BareduxStore<State, Mutations>}
 */
export default function Store({state: initialState, mutations}){
    
    let state = initialState;
    const subscribers = new Set()

    let callToSubscribersScheduled = false;
    function scheduleCallToSubscribers(){

        // schedule for next micro-task (or something like that)
        if(!callToSubscribersScheduled){
            callToSubscribersScheduled = true;
            Promise.resolve().then(() => {
                for(const s of subscribers){
                    try{ 
                        s(state)
                    }
                    catch(e){
                        console.error('subscriber error', e)
                    }
                }
                callToSubscribersScheduled = false;
            })
        }
    }

    function makeSubscribleMutationWrapper(mutations, propSequence=[]){
        return new Proxy(
            mutations,
            {
                get(mutations, name){
                    if(name in mutations){
                        return makeSubscribleMutationWrapper(mutations[name], [...propSequence, name])
                    }
                    else{
                        throw new TypeError(`No ${name} property in 'mutations.${propSequence.join('.')}'`)
                    }
                },
                apply(mutations, thisArg, argList){
                    // TODO : need to allow some logging plugin. Probably by defining other events
                    //console.log('apply trap', propSequence, argList)
    
                    if(typeof mutations !== 'function'){
                        throw new TypeError(`\`mutations.${propSequence.join('.')}\` is not a function`)
                    }
                    else{
                        const returnValue = Reflect.apply(mutations, undefined, [state, ...argList])
                        if(returnValue !== undefined){
                            state = returnValue
                        }
                        scheduleCallToSubscribers()
                        return returnValue
                    }
                }
            }
        )
    }

    return {
        get state(){ return state },
        
        mutations: makeSubscribleMutationWrapper(mutations),

        subscribe(fn){
            subscribers.add(fn)
            return () => { subscribers.delete(fn) }
        }
    }
}

