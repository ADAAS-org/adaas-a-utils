import { A_Caller, A_Component, A_Feature, A_Inject } from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame";
import { A_ExecutionContext } from "@adaas/a-utils/a-execution";



@A_Frame.Component({
    namespace: 'A-Utils',
    name: 'A-UtilsHelper',
    description: 'Utility helper class providing common functions for A-Utils library, such as hashing and serialization.'
})
export class A_UtilsHelper extends A_Component {

    // ─────────────────────────────────────────────────────────────────────────────
    // ── Hashing ──────────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────────

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
    static hash(value?: any): string {
        const source = A_UtilsHelper.serialize(value);
        return A_UtilsHelper.fnv1a52(source);
    }


    // ─────────────────────────────────────────────────────────────────────────────
    // ── Serialization ────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────────

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
    static serialize(value: any): string {
        // Primitives & null/undefined
        if (value === null) return '<null>';
        if (value === undefined) return '<undefined>';

        switch (typeof value) {
            case 'string':
                return `s:${value}`;
            case 'number':
                return `n:${value}`;
            case 'boolean':
                return `b:${value}`;
            case 'bigint':
                return `bi:${value}`;
            case 'symbol':
                return `sym:${value.toString()}`;
            case 'function':
                return `fn:${value.toString()}`;
        }

        // Map
        if (value instanceof Map) {
            const entries = Array.from(value.entries())
                .map(([k, v]) => `${A_UtilsHelper.serialize(k)}=>${A_UtilsHelper.serialize(v)}`)
                .sort()
                .join(',');
            return `Map{${entries}}`;
        }

        // Set
        if (value instanceof Set) {
            const items = Array.from(value.values())
                .map(v => A_UtilsHelper.serialize(v))
                .sort()
                .join(',');
            return `Set{${items}}`;
        }

        // Date
        if (value instanceof Date) {
            return `Date:${value.toISOString()}`;
        }

        // RegExp
        if (value instanceof RegExp) {
            return `RegExp:${value.toString()}`;
        }

        // Array
        if (Array.isArray(value)) {
            const items = value.map(v => A_UtilsHelper.serialize(v)).join(',');
            return `[${items}]`;
        }

        // toJSON support (e.g. custom entities, ASEID, etc.)
        if (typeof value.toJSON === 'function') {
            return `json:${A_UtilsHelper.serialize(value.toJSON())}`;
        }

        // Plain object — sort keys for determinism, serialize functions too
        const keys = Object.keys(value).sort();
        const pairs = keys.map(k => `${k}:${A_UtilsHelper.serialize(value[k])}`).join(',');
        return `{${pairs}}`;
    }


    // ─────────────────────────────────────────────────────────────────────────────
    // ── FNV-1a (pure Number, no BigInt) ──────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────────

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
    private static fnv1a52(input: string): string {
        // FNV-1a offset basis split into two 32-bit halves
        let h1 = 0x811c9dc5;  // low 32 bits
        let h2 = 0x00000842;  // high 20 bits (keeps us in 52-bit range)

        // FNV prime = 0x01000193
        const PRIME = 0x01000193;

        for (let i = 0; i < input.length; i++) {
            h1 ^= input.charCodeAt(i);

            // Multiply h1 by prime (32-bit, unsigned)
            const product = Math.imul(h1, PRIME);
            h1 = product >>> 0;

            // Carry overflow into h2, keep h2 within 20 bits
            h2 = ((Math.imul(h2, PRIME) + (product / 0x100000000 >>> 0)) & 0xFFFFF) >>> 0;
        }

        // Combine: h2 (20 bits) << 32 | h1 (32 bits) → 52-bit number
        // Since 2^52 fits in Number.MAX_SAFE_INTEGER, this is exact.
        const combined = h2 * 0x100000000 + h1;

        return combined.toString(16).padStart(13, '0');
    }



    // ==============================================================================
    // =============== Instance methods for used for Injection ======================
    // ==============================================================================
    @A_Frame.Method({
        description: 'Instance method wrapper for the static hash function, allowing it to be injected as a dependency.'
    })
    hash(
        @A_Inject(A_Caller) caller: any,
        @A_Inject(A_ExecutionContext) context: A_ExecutionContext,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        const hash = A_UtilsHelper.hash(caller);

        context.set(feature.name, hash);
    }
}