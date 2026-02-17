'use strict';

var aConcept = require('@adaas/a-concept');

class A_MemoryError extends aConcept.A_Error {
}
A_MemoryError.MemoryInitializationError = "Memory initialization error";
A_MemoryError.MemoryDestructionError = "Memory destruction error";
A_MemoryError.MemoryGetError = "Memory GET operation failed";
A_MemoryError.MemorySetError = "Memory SET operation failed";
A_MemoryError.MemoryDropError = "Memory DROP operation failed";
A_MemoryError.MemoryClearError = "Memory CLEAR operation failed";
A_MemoryError.MemoryHasError = "Memory HAS operation failed";
A_MemoryError.MemorySerializeError = "Memory toJSON operation failed";

exports.A_MemoryError = A_MemoryError;
//# sourceMappingURL=A-Memory.error.js.map
//# sourceMappingURL=A-Memory.error.js.map