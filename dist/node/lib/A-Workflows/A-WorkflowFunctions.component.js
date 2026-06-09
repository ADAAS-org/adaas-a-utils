'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var AWorkflows_error = require('./A-Workflows.error');
var AWorkflows_constants = require('./A-Workflows.constants');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_WorkflowFunctions = class A_WorkflowFunctions extends aConcept.A_Component {
  // ====================================================================
  // ================== Value Resolution ================================
  // ====================================================================
  /**
   * Resolve a single value source against the workflow `context`.
   *
   *   - `{ value }`     → the literal.
   *   - `{ from }`      → dot-path lookup into context (undefined if absent).
   *   - `{ fn, args }`  → apply the named {@link A_WorkflowValueFn} to the
   *                       resolved args.
   */
  resolveValue(context, source) {
    if (source === null || typeof source !== "object") {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.FunctionError,
        description: `Invalid value source: ${JSON.stringify(source)?.slice(0, 100)}`
      });
    }
    if ("value" in source) return source.value;
    if ("from" in source && typeof source.from === "string") {
      return this._get(context, source.from);
    }
    if ("fn" in source && typeof source.fn === "string") {
      const args = (source.args || []).map((a) => this.resolveValue(context, a));
      return this._applyValueFn(source.fn, args);
    }
    throw new AWorkflows_error.A_WorkflowError({
      title: AWorkflows_error.A_WorkflowError.FunctionError,
      description: `Value source must define one of "value" | "from" | "fn". Received: ${JSON.stringify(source)?.slice(0, 100)}`
    });
  }
  /**
   * Build a params object from a remap specification. Target keys support
   * dot-paths, so a remap may compose nested params.
   *
   * @example
   * ```ts
   * remap(ctx, { 'user.id': { from: 'params.id' }, token: { from: 'steps.login.token' } })
   * // => { user: { id: <ctx.params.id> }, token: <ctx.steps.login.token> }
   * ```
   */
  remap(context, spec) {
    const out = {};
    if (!spec) return out;
    for (const targetKey of Object.keys(spec)) {
      const value = this.resolveValue(context, spec[targetKey]);
      this._set(out, targetKey, value);
    }
    return out;
  }
  // ====================================================================
  // ================== Condition Evaluation ============================
  // ====================================================================
  /**
   * Evaluate a boolean condition against the workflow `context`. Unknown
   * function ids throw an {@link A_WorkflowError}.
   */
  evaluate(context, condition) {
    if (!condition) return true;
    const fn = condition.fn;
    switch (fn) {
      // ── Logical combinators ──────────────────────────────────
      case AWorkflows_constants.A_WorkflowConditionFn.AND:
        return (condition.conditions || []).every((c) => this.evaluate(context, c));
      case AWorkflows_constants.A_WorkflowConditionFn.OR:
        return (condition.conditions || []).some((c) => this.evaluate(context, c));
      case AWorkflows_constants.A_WorkflowConditionFn.NOT:
        return !(condition.conditions || []).every((c) => this.evaluate(context, c));
      // ── Unary predicates ─────────────────────────────────────
      case AWorkflows_constants.A_WorkflowConditionFn.EXISTS:
        return this._left(context, condition) !== void 0 && this._left(context, condition) !== null;
      case AWorkflows_constants.A_WorkflowConditionFn.NOT_EXISTS:
        return this._left(context, condition) === void 0 || this._left(context, condition) === null;
      case AWorkflows_constants.A_WorkflowConditionFn.TRUTHY:
        return !!this._left(context, condition);
      case AWorkflows_constants.A_WorkflowConditionFn.FALSY:
        return !this._left(context, condition);
      // ── Binary comparisons ───────────────────────────────────
      case AWorkflows_constants.A_WorkflowConditionFn.EQUALS:
        return this._left(context, condition) === this._right(context, condition);
      case AWorkflows_constants.A_WorkflowConditionFn.NOT_EQUALS:
        return this._left(context, condition) !== this._right(context, condition);
      case AWorkflows_constants.A_WorkflowConditionFn.GT:
        return this._left(context, condition) > this._right(context, condition);
      case AWorkflows_constants.A_WorkflowConditionFn.GTE:
        return this._left(context, condition) >= this._right(context, condition);
      case AWorkflows_constants.A_WorkflowConditionFn.LT:
        return this._left(context, condition) < this._right(context, condition);
      case AWorkflows_constants.A_WorkflowConditionFn.LTE:
        return this._left(context, condition) <= this._right(context, condition);
      case AWorkflows_constants.A_WorkflowConditionFn.IN: {
        const haystack = this._right(context, condition);
        const needle = this._left(context, condition);
        return Array.isArray(haystack) ? haystack.includes(needle) : false;
      }
      case AWorkflows_constants.A_WorkflowConditionFn.MATCHES: {
        const value = this._left(context, condition);
        const pattern = this._right(context, condition);
        try {
          return new RegExp(String(pattern)).test(String(value));
        } catch {
          return false;
        }
      }
      default:
        throw new AWorkflows_error.A_WorkflowError({
          title: AWorkflows_error.A_WorkflowError.FunctionError,
          description: `Unknown condition function "${fn}".`
        });
    }
  }
  // ====================================================================
  // ================== Internal Helpers ================================
  // ====================================================================
  /** Resolve the `left` operand of a condition (undefined when omitted). */
  _left(context, condition) {
    return condition.left ? this.resolveValue(context, condition.left) : void 0;
  }
  /** Resolve the `right` operand of a condition (undefined when omitted). */
  _right(context, condition) {
    return condition.right ? this.resolveValue(context, condition.right) : void 0;
  }
  /** Apply a predefined value-transform function to already-resolved args. */
  _applyValueFn(fn, args) {
    switch (fn) {
      case AWorkflows_constants.A_WorkflowValueFn.CONCAT:
        return args.map((a) => a === void 0 || a === null ? "" : String(a)).join("");
      case AWorkflows_constants.A_WorkflowValueFn.UPPERCASE:
        return String(args[0] ?? "").toUpperCase();
      case AWorkflows_constants.A_WorkflowValueFn.LOWERCASE:
        return String(args[0] ?? "").toLowerCase();
      case AWorkflows_constants.A_WorkflowValueFn.COALESCE:
        return args.find((a) => a !== void 0 && a !== null);
      case AWorkflows_constants.A_WorkflowValueFn.NOW:
        return (/* @__PURE__ */ new Date()).toISOString();
      case AWorkflows_constants.A_WorkflowValueFn.SUM:
        return args.reduce((acc, a) => acc + (Number(a) || 0), 0);
      case AWorkflows_constants.A_WorkflowValueFn.NOT:
        return !args[0];
      case AWorkflows_constants.A_WorkflowValueFn.JSON:
        return JSON.stringify(args[0]);
      default:
        throw new AWorkflows_error.A_WorkflowError({
          title: AWorkflows_error.A_WorkflowError.FunctionError,
          description: `Unknown value function "${fn}".`
        });
    }
  }
  /**
   * Read a dot-path from an object. Supports nested objects and numeric
   * array indices (e.g. `steps.list.0.id`). Returns undefined on any
   * missing segment rather than throwing.
   */
  _get(obj, path) {
    if (!path) return void 0;
    let cursor = obj;
    for (const segment of path.split(".")) {
      if (cursor === void 0 || cursor === null) return void 0;
      cursor = cursor[segment];
    }
    return cursor;
  }
  /**
   * Write a value at a dot-path into an object, creating intermediate
   * objects as needed.
   */
  _set(obj, path, value) {
    const segments = path.split(".");
    let cursor = obj;
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      if (cursor[segment] === void 0 || cursor[segment] === null || typeof cursor[segment] !== "object") {
        cursor[segment] = {};
      }
      cursor = cursor[segment];
    }
    cursor[segments[segments.length - 1]] = value;
  }
};
exports.A_WorkflowFunctions = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Predefined, JSON-serialization-safe function library for A-Workflows. Resolves value sources (literal / context-path / named transform), builds remapped step params, and evaluates portable boolean conditions so distributed workflows behave identically on every service."
  })
], exports.A_WorkflowFunctions);
//# sourceMappingURL=A-WorkflowFunctions.component.js.map
//# sourceMappingURL=A-WorkflowFunctions.component.js.map