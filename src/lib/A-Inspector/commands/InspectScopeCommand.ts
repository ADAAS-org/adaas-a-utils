import { A_Command } from "@adaas/a-utils/a-command";
import { A_Frame } from "@adaas/a-frame/core";

import type { A_TYPES__InspectorScopeSnapshot } from "../A-Inspector.types";


export type InspectScopeCommandParams = {
    /**
     * Either a scope name (matches against `scope.name`) or the literal
     * string `"root"` to inspect the concept's root scope. If omitted,
     * defaults to the root scope.
     */
    scope?: string;
};


/**
 * Returns a snapshot of a single scope reachable from the root scope.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectScopeExecute`.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Returns a snapshot of a single scope (components, fragments, entities, errors, imports) by name.'
})
export class InspectScopeCommand extends A_Command<
    InspectScopeCommandParams,
    { snapshot: A_TYPES__InspectorScopeSnapshot }
> {
    static override get entity(): string {
        return 'inspect-scope';
    }
}
