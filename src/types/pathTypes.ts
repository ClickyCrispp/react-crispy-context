type Primitive =
    | null
    | undefined
    | string
    | number
    | boolean
    | symbol
    | bigint;

interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}

interface FileList {
    readonly length: number;
    item(index: number): File | null;
    [index: number]: File;
}

type BrowserNativeObject = Date | FileList | File;

type PathImpl<K extends string, V> = V extends
    | Primitive
    | BrowserNativeObject
    ? `${K}`
    : `${K}` | `${K}.${Path<V>}`;

export type Path<T> = T extends ReadonlyArray<infer V>
    ? PathImpl<string, V>
    : {
        [K in keyof T]-?: PathImpl<K & string, T[K]>;
    }[keyof T];

export type PathValue<T, P extends Path<T>> =
    T extends any
        ? P extends `${infer K}.${infer R}`
        ? K extends keyof T
            ? R extends Path<T[K]>
            ? PathValue<T[K], R>
            : never
            : K extends number
            ? T extends ReadonlyArray<infer V>
                ? PathValue<V, R & Path<V>>
                : never
            : never
        : P extends keyof T
            ? T[P]
            : P extends number
            ? T
            : never
        : never;