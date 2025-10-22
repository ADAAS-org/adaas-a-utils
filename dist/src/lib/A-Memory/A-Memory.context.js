"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Memory = void 0;
const a_concept_1 = require("@adaas/a-concept");
class A_Memory extends a_concept_1.A_Fragment {
    /**
     * Memory object that allows to store intermediate values and errors
     *
     * @param initialValues
     */
    constructor(initialValues) {
        super();
        this._memory = new Map(Object.entries(initialValues || {}));
        this._errors = new Set();
    }
    get Errors() {
        return this._errors.size > 0 ? this._errors : undefined;
    }
    /**
     * Verifies that all required keys are present in the proxy values
     *
     * @param requiredKeys
     * @returns
     */
    verifyPrerequisites(requiredKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            return requiredKeys.every(key => this._memory.has(key));
        });
    }
    /**
     * Adds an error to the context
     *
     * @param error
     */
    error(error) {
        return __awaiter(this, void 0, void 0, function* () {
            this._errors.add(error);
        });
    }
    /**
     * Saves a value in the context memory
     *
     * @param key
     * @param value
     */
    set(
    /**
     * Key to save the value under
     */
    key, 
    /**
     * Value to save
     */
    value) {
        return __awaiter(this, void 0, void 0, function* () {
            this._memory.set(key, value);
        });
    }
    /**
     * Removes a value from the context memory by key
     *
     * @param key
     */
    drop(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this._memory.delete(key);
        });
    }
    /**
     * Clears all stored values in the context memory
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this._memory.clear();
        });
    }
    /**
     * Converts all stored values to a plain object
     *
     * [!] By default uses all saved in memory values
     *
     * @returns
     */
    toJSON() {
        const obj = {};
        this._memory.forEach((value, key) => {
            obj[key] =
                typeof value === 'object' && value !== null && 'toJSON' in value && typeof value.toJSON === 'function'
                    ? value.toJSON()
                    : value;
        });
        return obj;
    }
}
exports.A_Memory = A_Memory;
//# sourceMappingURL=A-Memory.context.js.map