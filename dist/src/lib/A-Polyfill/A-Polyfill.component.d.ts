import { A_Component } from "@adaas/a-concept";
import { A_PolyfillClass } from "./A-Polyfills.class";
export declare class A_Polyfill extends A_Component {
    protected _polyfill: A_PolyfillClass;
    load(): Promise<void>;
    /**
     * Allows to use the 'fs' polyfill methods regardless of the environment
     * This method loads the 'fs' polyfill and returns its instance
     *
     * @returns
     */
    fs(): Promise<import("./A-Polyfill.types").Ifspolyfill>;
    /**
     * Allows to use the 'crypto' polyfill methods regardless of the environment
     * This method loads the 'crypto' polyfill and returns its instance
     *
     * @returns
     */
    crypto(): Promise<import("./A-Polyfill.types").IcryptoInterface>;
}
