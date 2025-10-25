import { A_TYPES__Component_Constructor } from "@adaas/a-concept";
import { A_Manifest } from "../A-Manifest.context";
import { A_UTILS_TYPES__Manifest_AllowedComponents } from "../A-Manifest.types";
/**
 * Fluent API for checking manifest permissions
 */
export declare class A_ManifestChecker {
    private manifest;
    private component;
    private method;
    private checkExclusion;
    constructor(manifest: A_Manifest, component: A_TYPES__Component_Constructor, method: string, checkExclusion?: boolean);
    for(target: A_UTILS_TYPES__Manifest_AllowedComponents): boolean;
}
