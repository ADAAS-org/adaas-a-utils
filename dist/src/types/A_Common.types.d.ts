export type A_AUTH_RequestParam = {
    id?: string;
    /**
     * The issuer of the parameter. Could be system, custom, proxy, credentials or SIC to data provider service(e.g. CSS)
     */
    issuer?: 'system' | 'custom' | 'proxy' | 'credentials' | string;
    /**
     * Common internal value, uses for proper mapping
     */
    key?: string;
    /**
     * Allows to define the type of the parameter to convert input during the execution
     */
    type: 'json' | 'array' | 'number' | 'string' | 'boolean' | 'base_64' | 'file' | 'file_url';
    /**
     * The name of the parameter
     */
    name: string;
    /**
     * The value of the parameter
     */
    value: string;
};
type Decrement = [never, 0, 1, 2, 3, 4, 5];
export type A_TYPES__DeepPartial<T, D extends number = 5> = {
    [P in keyof Required<T>]?: [
        D
    ] extends [never] ? any : Required<T>[P] extends Array<infer U> ? Array<A_TYPES__DeepPartial<U, Decrement[D]>> : Required<T>[P] extends Function ? Required<T>[P] : Required<T>[P] extends object ? A_TYPES__DeepPartial<T[P], Decrement[D]> : T[P];
};
export type A_TYPES__ObjectKeyEnum<T, E> = {
    [P in keyof Required<T>]?: T[P] extends object ? A_TYPES__ObjectKeyEnum<T[P], E> : E;
};
export type A_TYPES__Dictionary<T> = {
    [Key: string]: T;
};
export type A_TYPES__NonObjectPaths<T> = T extends object ? {
    [K in keyof T]: `${Exclude<K, symbol>}${""}`;
}[keyof T] : never;
export type A_TYPES__Paths<T, D extends number = 5> = [D] extends [never] ? never : (T extends object ? {
    [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${A_TYPES__Paths<T[K], Decrement[D]>}`}`;
}[keyof T] : never);
export type A_TYPES__UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type A_TYPES__PathsToObject<_Obj, T extends readonly string[]> = A_TYPES__UnionToIntersection<{
    [K in keyof T]: T[K] extends `${infer Key}.${infer Rest}` ? {
        [P in Key]: P extends keyof _Obj ? A_TYPES__PathsToObject<Required<_Obj>[P], [Rest]> : any;
    } : {
        [P in T[K]]: `${T[K]}` extends keyof Required<_Obj> ? Required<_Obj>[`${T[K]}`] : never;
    };
}[number]>;
export type A_TYPES__Required<T, arr extends (A_TYPES__Paths<T>)[] = (A_TYPES__Paths<T>)[]> = A_TYPES__PathsToObject<T, arr> & T;
export type A_TYPES__ExtractNested<T, P extends string> = P extends `${infer K}.${infer Rest}` ? K extends keyof T ? {
    [Key in K]: A_TYPES__ExtractNested<T[K], Rest>;
} : never : P extends keyof T ? {
    [Key in P]: T[P];
} : never;
export type A_TYPES__ExtractProperties<T, P extends A_TYPES__Paths<T>[]> = A_TYPES__UnionToIntersection<{
    [K in keyof P]: P[K] extends string ? A_TYPES__ExtractNested<T, P[K]> : never;
}[number]>;
export {};
