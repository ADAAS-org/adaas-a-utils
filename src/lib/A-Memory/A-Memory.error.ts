import { A_Error } from "@adaas/a-concept";


export class A_MemoryError extends A_Error {

    static readonly MemoryInitializationError = 'Memory initialization error';

    static readonly MemoryDestructionError = 'Memory destruction error';

    static readonly MemoryGetError = 'Memory GET operation failed';

    static readonly MemorySetError = 'Memory SET operation failed';

    static readonly MemoryDropError = 'Memory DROP operation failed';

    static readonly MemoryClearError = 'Memory CLEAR operation failed';

    static readonly MemoryHasError = 'Memory HAS operation failed';

    static readonly MemorySerializeError = 'Memory toJSON operation failed';
}
