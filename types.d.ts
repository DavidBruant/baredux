// from https://stackoverflow.com/questions/41879327/deepreadonly-object-typescript
type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
}

interface BareduxInputMutations<State> {
    [key: string]: (state: State, ...others: any[]) => void | State
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => any ? (...args: P) => ReturnType<F> : never;

// This only does one layer of mutations and does not go deep
type BareduxOutputMutations<BareduxInputMutationsType> = {
    [Property in keyof BareduxInputMutationsType]: OmitFirstArg<BareduxInputMutationsType[Property]>
}

interface BareduxStore<State, InputMutations extends BareduxInputMutations<State>> {
    state: DeepReadonly<State>,
    mutations: BareduxOutputMutations<InputMutations>,
    subscribe: (subscriber: (state: State) => void) => (() => void)
}

export default function Store<State, Mutations extends BareduxInputMutations<State>>({ state, mutations }: {
    state: State;
    mutations: Mutations;
}): BareduxStore<State, Mutations>