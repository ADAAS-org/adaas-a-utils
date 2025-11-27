import { A_Error } from "@adaas/a-concept"
import { A_OperationContext } from "../A-Operation/A-Operation.context";


export type A_MemoryContextMeta<T extends Record<string, any> = Record<string, any>> = Omit<T, 'error'> & {
    error?: A_Error,
}

export type A_Memory_Storage = Record<string, any> & {
    error?: A_Error,
}

export type A_MemoryOperations = 'get' | 'set' | 'drop' | 'clear' | 'has' | 'serialize';



export type A_MemoryOperationContext<T extends any = any> = A_OperationContext<
    A_MemoryOperations,
    { key: string, value?: any },
    T
>;


export type A_MemoryOperationContextMeta<
    T extends any = any,
    I extends any = any
> = {
    result: T,
    operation: A_MemoryOperations,
    key: string,
    value?: I,
}