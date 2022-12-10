import React, {
    useRef,
    createContext,
    useContext,
    useCallback,
    useSyncExternalStore,
    PropsWithChildren,
} from 'react';
import { Path } from './types/pathTypes';
import { CreateFastContextReturnType, GetStateSlice, MakeSetStateSlice, UseStoreDataReturnType, UseStoreReturnType, UseStoreStateReturnTypesMap } from './types/types';

/**
    Creates a context object with a Provider component and a useStore hook.
    The Provider component should be used to wrap the root of the application tree,
    and the useStore hook should be used by child components to access and update the context store.
    @param initialState - The initial value of the store.
    @param options - An object containing options for the store.
    @returns An object containing the Provider component and the useStore hook.
*/
export function createReactCrispyContext<Store>(
    initialState: Store,
): CreateFastContextReturnType<Store> {
    const StoreContext = createContext<UseStoreDataReturnType<Store> | null>(null);

    function Provider({ children }: PropsWithChildren<{}>) {
        const subscribers = useRef(new Set<() => void>());
        const store = useRef<Store>(initialState);

        const get = useCallback<GetStateSlice<Store>>((path) => {
            const keys = (path as string).split('.');
            return keys.reduce((value: any, key) => (value)?.[key], store.current);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const makeSet = useCallback<MakeSetStateSlice<Store>>((path) => (value) => {
            const keys = path.split('.');

            keys?.reduce((acc: any, key, index) => {
                if (index === keys.length - 1) {
                    acc[key] = value;
                } else {
                    if (!acc?.[key]) {
                        throw Error('Implementation Error: key not defined, must be defined before accessing a path');
                    }
                    return acc[key];
                }
            }, store.current);

            subscribers.current.forEach(callback => callback());
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const subscribe = useCallback((callback: () => void) => {
            subscribers.current.add(callback);
            return () => subscribers.current.delete(callback);
        }, []);

        return (
            <StoreContext.Provider value={{ get, makeSet, subscribe }}>
                {children}
            </StoreContext.Provider>
        );
    }

    function useStoreState<T extends Path<Store>>(
        selector: T,
    ): UseStoreStateReturnTypesMap<Store, T>['State'] {
        const store = useContext(StoreContext);
        if (!store) {
            throw new Error('Store not found');
        }

        const getInitialStateSlice = useCallback<GetStateSlice<Store>>((path) => {
            const keys = (path as string).split('.');
            return keys.reduce((value, key) => (value as any)[key], initialState as any);
        }, []);

        const state = useSyncExternalStore(
            store.subscribe,
            () => store.get(selector),
            () => getInitialStateSlice(selector),
        );

        return state;
    }

    function useStoreUpdater<T extends Path<Store>>(
        selector: T,
    ): UseStoreStateReturnTypesMap<Store, T>['Updater'] {
        const store = useContext(StoreContext);
        if (!store) {
            throw new Error('Store not found');
        }
        return store.makeSet(selector);
    }

    function useStore<T extends Path<Store>>(
        selector: T,
    ): UseStoreReturnType<Store, T> {
        return [useStoreState(selector), useStoreUpdater(selector)];
    }

    return {
        Provider,
        useStore,
        useStoreState,
        useStoreUpdater,
    };
}