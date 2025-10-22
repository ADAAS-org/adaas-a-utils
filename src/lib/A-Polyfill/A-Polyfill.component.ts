import { A_Component } from "@adaas/a-concept";
import { A_PolyfillClass } from "./A-Polyfills.class";



export class A_Polyfill extends A_Component {

    protected _polyfill!: A_PolyfillClass;

    async load() {
        this._polyfill = new A_PolyfillClass();

        await this._polyfill.fs();
        await this._polyfill.crypto();
    }


    /**
     * Allows to use the 'fs' polyfill methods regardless of the environment
     * This method loads the 'fs' polyfill and returns its instance
     * 
     * @returns 
     */
    async fs() {
        if (!this._polyfill) {
            await this.load();
        }

        return await this._polyfill.fs();
    }

    /**
     * Allows to use the 'crypto' polyfill methods regardless of the environment
     * This method loads the 'crypto' polyfill and returns its instance
     * 
     * @returns 
     */
    async crypto() {
        if (!this._polyfill) {
            await this.load();
        }

        return await this._polyfill.crypto();
    }
}