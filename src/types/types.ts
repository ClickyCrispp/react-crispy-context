import React, {
    PropsWithChildren,
} from 'react';
import { Path, PathValue } from './pathTypes';

export type GetStateSlice<T> = <K extends Path<T>>(path: K) => PathValue<T, K>;
export type SetStateSlice<T, K extends Path<T>> = (value: PathValue<T, K>) => void

export type MakeSetStateSlice<T> = <K extends Path<T>>(path: K) => SetStateSlice<T, K>

export type UseStoreDataReturnType<Store> = {
    get: GetStateSlice<Store>;
    makeSet: MakeSetStateSlice<Store>
    subscribe: (callback: () => void) => () => void;
};

export type UseStoreStateReturnTypesMap<Store, T extends Path<Store>> = {
    State: PathValue<Store, T>;
    Updater: SetStateSlice<Store, T>;
}

export type UseStoreReturnType<Store, T extends Path<Store>> = [
    UseStoreStateReturnTypesMap<Store, T>['State'],
    UseStoreStateReturnTypesMap<Store, T>['Updater']
]

export interface CreateFastContextReturnType<Store> {
    Provider: (props: PropsWithChildren<{}>) => React.ReactElement<any, any> | null;
    useStoreState: <T extends Path<Store>>(selector: T) => PathValue<Store, T>;
    useStoreUpdater: <T extends Path<Store>>(selector: T) => SetStateSlice<Store, T>;
    useStore: <T extends Path<Store>>(
        selector: T,
    ) => UseStoreReturnType<Store, T>;
}