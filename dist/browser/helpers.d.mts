import { A_Component, A_Feature } from '@adaas/a-concept';
import { A_ExecutionContext } from './a-execution.mjs';

declare class A_UtilsHelper extends A_Component {
    /**
     * Produces a deterministic, collision-resistant hash string for any JS value.
     *
     * Improvements over the legacy `createHash`:
     *  - **Null-safe** — handles `null` without throwing
     *  - **Function-aware serialization** — functions inside objects / arrays are
     *    serialized via `.toString()` so `{ fn: () => 1 }` ≠ `{}`
     *  - **FNV-1a 52-bit** — better avalanche / distribution than DJB2-32,
     *    and uses the safe JS integer range so the result is always positive
     *  - **Hex output** — compact, URL-safe, fixed-width (13 chars)
     *
     * @param value  Any value: string, number, boolean, null, undefined,
     *               object, array, Map, Set, function, or a mix of these.
     * @returns      A 13-character lower-hex string (52-bit FNV-1a).
     */
    static hash(value?: any): string;
    /**
     * Converts any JS value into a deterministic string representation
     * suitable for hashing.
     *
     * Key properties:
     *  - **Deterministic**: same logical value → same string every time
     *  - **Injective-ish**: structurally different values produce different
     *    strings (type tags prevent `"3"` vs `3` collisions)
     *  - **Recursive**: handles nested objects, arrays, Maps, Sets
     *  - **Function-aware**: serializes functions via `.toString()`
     *
     * @param value  Anything.
     * @returns      A deterministic string.
     */
    static serialize(value: any): string;
    /**
     * Sets a nested property on an object using a dot-separated path string. This method safely navigates through the object structure and sets the value at the specified path, creating intermediate objects as needed. If any part of the path is invalid or if the input parameters are not properly formatted, the method will simply return without making any changes to the object.
     *
     * @param obj The object on which to set the property.
     * @param path A dot-separated string representing the path to the desired property (e.g., "user.profile.name").
     * @param value The value to set at the specified path.
     * @returns the target object with the updated property, or undefined if the input parameters are invalid.
     */
    static setBypath(obj: unknown, path: string, value: any): Record<string, any> | undefined;
    /**
     * Extracts a nested property from an object using a dot-separated path string. This method safely navigates through the object structure and returns the value at the specified path, or undefined if any part of the path is invalid or does not exist.
     *
     * @param obj The object from which to extract the property.
     * @param path A dot-separated string representing the path to the desired property (e.g., "user.profile.name").
     * @returns The value at the specified path, or undefined if the path is invalid or does not exist.
     */
    static getByPath<T = any>(obj: unknown, path: string): T | undefined;
    /**
     * FNV-1a hash using two 32-bit halves to simulate a 52-bit space,
     * without requiring BigInt.
     *
     * Works identically in:
     *  - All browsers (including Safari 13, IE11 polyfill targets, React Native)
     *  - Node.js (any version)
     *  - Web Workers, Service Workers, Deno, Bun
     *
     * - Better avalanche than DJB2 (each input bit affects many output bits)
     * - ~52-bit effective space — vastly fewer collisions than 32-bit
     * - Always produces a **positive** hex string of 13 characters
     *
     * @param input  Pre-serialized string.
     * @returns      13-character lower-hex string.
     */
    private static fnv1a52;
    hash(caller: any, context: A_ExecutionContext, feature: A_Feature): void;
    serialize(caller: any, context: A_ExecutionContext, feature: A_Feature): void;
    setByPath(caller: any, context: A_ExecutionContext, feature: A_Feature): void;
    getByPath(caller: any, context: A_ExecutionContext, feature: A_Feature): void;
}

export { A_UtilsHelper };
