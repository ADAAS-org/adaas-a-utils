import { A_TYPES__Component_Constructor } from "@adaas/a-concept";
import { A_Manifest } from "../A-Manifest.context";

/**
 * Fluent API for checking manifest permissions
 */
export class A_ManifestChecker {
    constructor(
        private manifest: A_Manifest,
        private component: A_TYPES__Component_Constructor,
        private method: string,
        private checkExclusion: boolean = false
    ) {}

    for(target: A_TYPES__Component_Constructor): boolean {
        const result = this.manifest.internal_checkAccess({
            component: this.component,
            method: this.method,
            target: target
        });

        return this.checkExclusion ? !result : result;
    }
}