import { A_Command } from "@adaas/a-utils/a-command";
import { A_Frame } from "@adaas/a-frame/core";

import type {
    A_TYPES__InspectorConceptSnapshot,
} from "../A-Inspector.types";


/**
 * Returns a high-level snapshot of the running concept: its name,
 * runtime environment, root scope contents, and all containers known
 * through `A_Context`'s allocation registry.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectConceptExecute`.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Returns a snapshot of the running concept: name, environment, root scope, and all allocated containers.'
})
export class InspectConceptCommand extends A_Command<
    {},
    { snapshot: A_TYPES__InspectorConceptSnapshot }
> {
    static override get entity(): string {
        return 'inspect-concept';
    }
}
