"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.A_Channel = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Channel_error_1 = require("./A-Channel.error");
class A_Channel extends a_concept_1.A_Component {
    constructor() {
        super(...arguments);
        /**
         * Indicates whether the channel is processing requests
         */
        this._processing = false;
    }
    /**
      * Indicates whether the channel is processing requests
      */
    get processing() {
        return this._processing;
    }
    /**
     * Indicates whether the channel is connected
     */
    get initialize() {
        if (!this._initialized) {
            this._initialized = this.connect();
        }
        return this._initialized;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new A_Channel_error_1.A_ChannelError(A_Channel_error_1.A_ChannelError.MethodNotImplemented, `The connect method is not implemented in ${this.constructor.name} channel. This method is required to initialize the channel before use. So please implement it in the derived class.`);
        });
    }
    request(params) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new A_Channel_error_1.A_ChannelError(A_Channel_error_1.A_ChannelError.MethodNotImplemented, `The request method is not implemented in ${this.constructor.name} channel.`);
        });
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new A_Channel_error_1.A_ChannelError(A_Channel_error_1.A_ChannelError.MethodNotImplemented, `The send method is not implemented in ${this.constructor.name} channel.`);
        });
    }
}
exports.A_Channel = A_Channel;
__decorate([
    a_concept_1.A_Feature.Define()
    /**
     * Initializes the channel before use
     */
], A_Channel.prototype, "connect", null);
__decorate([
    a_concept_1.A_Feature.Define()
    /**
     * Allows to send a request through the channel
     *
     * @param req - The request parameters
     * @returns The response from the channel
     */
], A_Channel.prototype, "request", null);
__decorate([
    a_concept_1.A_Feature.Define()
    /**
     * Uses for Fire-and-Forget messaging through the channel
     *
     * @param message - can be of any type depending on the channel implementation
     */
], A_Channel.prototype, "send", null);
//# sourceMappingURL=A-Channel.component.js.map