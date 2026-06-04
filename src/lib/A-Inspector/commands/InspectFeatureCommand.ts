import { A_Command } from "@adaas/a-utils/a-command";
import { A_Frame } from "@adaas/a-frame/core";

import type {
    A_TYPES__InspectorFeatureSnapshot,
} from "../A-Inspector.types";


export type InspectFeatureCommandParams = {
    /** Name of the component / container / entity to inspect. */
    component: string;
    /** Name of the feature to inspect. */
    feature: string;
    /** Optional scope name to evaluate the feature template under. */
    scope?: string;
};


/**
 * Returns the topologically-sorted step list that would execute when
 * `<component>.call(<feature>)` is invoked under the given scope.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectFeatureExecute`.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Returns the resolved feature template (stage steps) for a given component + feature + scope, exactly as A_Feature would execute it.'
})
export class InspectFeatureCommand extends A_Command<
    InspectFeatureCommandParams,
    { snapshot: A_TYPES__InspectorFeatureSnapshot }
> {
    static override get entity(): string {
        return 'inspect-feature';
    }
}
