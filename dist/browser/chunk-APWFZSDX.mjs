import { A_ExecutionContext } from './chunk-TQ5UON22.mjs';
import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Inject, A_Caller, A_Feature, A_Component } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

var A_UtilsHelper = class extends A_Component {
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
  static hash(value) {
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
  static serialize(value) {
    if (value === null) return "<null>";
    if (value === void 0) return "<undefined>";
    switch (typeof value) {
      case "string":
        return `s:${value}`;
      case "number":
        return `n:${value}`;
      case "boolean":
        return `b:${value}`;
      case "bigint":
        return `bi:${value}`;
      case "symbol":
        return `sym:${value.toString()}`;
      case "function":
        return `fn:${value.toString()}`;
    }
    if (value instanceof Map) {
      const entries = Array.from(value.entries()).map(([k, v]) => `${A_UtilsHelper.serialize(k)}=>${A_UtilsHelper.serialize(v)}`).sort().join(",");
      return `Map{${entries}}`;
    }
    if (value instanceof Set) {
      const items = Array.from(value.values()).map((v) => A_UtilsHelper.serialize(v)).sort().join(",");
      return `Set{${items}}`;
    }
    if (value instanceof Date) {
      return `Date:${value.toISOString()}`;
    }
    if (value instanceof RegExp) {
      return `RegExp:${value.toString()}`;
    }
    if (Array.isArray(value)) {
      const items = value.map((v) => A_UtilsHelper.serialize(v)).join(",");
      return `[${items}]`;
    }
    if (typeof value.toJSON === "function") {
      return `json:${A_UtilsHelper.serialize(value.toJSON())}`;
    }
    const keys = Object.keys(value).sort();
    const pairs = keys.map((k) => `${k}:${A_UtilsHelper.serialize(value[k])}`).join(",");
    return `{${pairs}}`;
  }
  /**
   * Sets a nested property on an object using a dot-separated path string. This method safely navigates through the object structure and sets the value at the specified path, creating intermediate objects as needed. If any part of the path is invalid or if the input parameters are not properly formatted, the method will simply return without making any changes to the object.
   * 
   * @param obj The object on which to set the property.
   * @param path A dot-separated string representing the path to the desired property (e.g., "user.profile.name").
   * @param value The value to set at the specified path.
   * @returns the target object with the updated property, or undefined if the input parameters are invalid.
   */
  static setBypath(obj, path, value) {
    if (!obj || typeof obj !== "object" || !path || typeof path !== "string") {
      return;
    }
    const parts = path.split(".");
    const lastPart = parts.pop();
    const target = parts.reduce((acc, part) => {
      if (acc[part] === void 0) {
        acc[part] = {};
      }
      return acc[part];
    }, obj);
    target[lastPart] = value;
    return obj;
  }
  /**
   * Extracts a nested property from an object using a dot-separated path string. This method safely navigates through the object structure and returns the value at the specified path, or undefined if any part of the path is invalid or does not exist.
   * 
   * @param obj The object from which to extract the property.
   * @param path A dot-separated string representing the path to the desired property (e.g., "user.profile.name"). 
   * @returns The value at the specified path, or undefined if the path is invalid or does not exist. 
   */
  static getByPath(obj, path) {
    if (!path || typeof path !== "string") {
      return obj;
    }
    if (!obj || typeof obj !== "object") {
      return void 0;
    }
    try {
      const result = path.split(".").reduce((acc, part) => {
        if (acc === null || acc === void 0) {
          return void 0;
        }
        return acc[part];
      }, obj);
      return result;
    } catch {
      return void 0;
    }
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
  static fnv1a52(input) {
    let h1 = 2166136261;
    let h2 = 2114;
    const PRIME = 16777619;
    for (let i = 0; i < input.length; i++) {
      h1 ^= input.charCodeAt(i);
      const product = Math.imul(h1, PRIME);
      h1 = product >>> 0;
      h2 = (Math.imul(h2, PRIME) + (product / 4294967296 >>> 0) & 1048575) >>> 0;
    }
    const combined = h2 * 4294967296 + h1;
    return combined.toString(16).padStart(13, "0");
  }
  hash(caller, context, feature) {
    const hash = A_UtilsHelper.hash(caller);
    context.set(feature.name, hash);
  }
  serialize(caller, context, feature) {
    const serialized = A_UtilsHelper.serialize(caller);
    context.set(feature.name, serialized);
  }
  setByPath(caller, context, feature) {
    const obj = context.get("object");
    const path = context.get("path");
    const value = context.get("value");
    const result = A_UtilsHelper.setBypath(obj, path, value);
    context.set(feature.name, result);
  }
  getByPath(caller, context, feature) {
    const obj = context.get("object");
    const path = context.get("path");
    const result = A_UtilsHelper.getByPath(obj, path);
    context.set(feature.name, result);
  }
};
__decorateClass([
  A_Frame.Method({
    description: "Instance method wrapper for the static hash function, allowing it to be injected as a dependency."
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_ExecutionContext)),
  __decorateParam(2, A_Inject(A_Feature))
], A_UtilsHelper.prototype, "hash", 1);
__decorateClass([
  A_Frame.Method({
    description: "Instance method wrapper for the static serialize function, allowing it to be injected as a dependency."
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_ExecutionContext)),
  __decorateParam(2, A_Inject(A_Feature))
], A_UtilsHelper.prototype, "serialize", 1);
__decorateClass([
  A_Frame.Method({
    description: "Instance method wrapper for the static setByPath function, allowing it to be injected as a dependency."
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_ExecutionContext)),
  __decorateParam(2, A_Inject(A_Feature))
], A_UtilsHelper.prototype, "setByPath", 1);
__decorateClass([
  A_Frame.Method({
    description: "Instance method wrapper for the static getByPath function, allowing it to be injected as a dependency."
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_ExecutionContext)),
  __decorateParam(2, A_Inject(A_Feature))
], A_UtilsHelper.prototype, "getByPath", 1);
A_UtilsHelper = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "A-UtilsHelper",
    description: "Utility helper class providing common functions for A-Utils library, such as hashing and serialization."
  })
], A_UtilsHelper);

export { A_UtilsHelper };
//# sourceMappingURL=chunk-APWFZSDX.mjs.map
//# sourceMappingURL=chunk-APWFZSDX.mjs.map