"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Polyfill = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Polyfills_class_1 = require("./A-Polyfills.class");
class A_Polyfill extends a_concept_1.A_Component {
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this._polyfill = new A_Polyfills_class_1.A_PolyfillClass();
            yield this._polyfill.fs();
            yield this._polyfill.crypto();
        });
    }
    /**
     * Allows to use the 'fs' polyfill methods regardless of the environment
     * This method loads the 'fs' polyfill and returns its instance
     *
     * @returns
     */
    fs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._polyfill) {
                yield this.load();
            }
            return yield this._polyfill.fs();
        });
    }
    /**
     * Allows to use the 'crypto' polyfill methods regardless of the environment
     * This method loads the 'crypto' polyfill and returns its instance
     *
     * @returns
     */
    crypto() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._polyfill) {
                yield this.load();
            }
            return yield this._polyfill.crypto();
        });
    }
}
exports.A_Polyfill = A_Polyfill;
//# sourceMappingURL=A-Polyfill.component.js.map