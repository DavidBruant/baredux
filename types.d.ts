// from https://stackoverflow.com/questions/41879327/deepreadonly-object-typescript
type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
}

type BareduxInputMutations<State> = {
    [key: string]: (state: State, ...others: any[]) => void | State
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer Args) => any ? (...args: Args) => ReturnType<F> : never;

// This only does one layer of mutations and does not go deep
type BareduxOutputMutations<BareduxInputMutationsType> = {
    [Property in keyof BareduxInputMutationsType]: OmitFirstArg<BareduxInputMutationsType[Property]>
}

type BareduxStore<State, InputMutations extends BareduxInputMutations<State>> = {
    state: DeepReadonly<State>,
    mutations: BareduxOutputMutations<InputMutations>,
    subscribe: (subscriber: (state: State) => void) => (() => void)
}

export default function Store<State, Mutations extends BareduxInputMutations<State>>(
    { state: State, mutations : Mutations }
): BareduxStore<State, Mutations>