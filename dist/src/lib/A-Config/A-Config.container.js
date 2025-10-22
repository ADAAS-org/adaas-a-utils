"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.A_ConfigLoader = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Config_context_1 = require("./A-Config.context");
const A_Polyfill_component_1 = require("../A-Polyfill/A-Polyfill.component");
const A_Config_error_1 = require("./A-Config.error");
const FileConfigReader_component_1 = require("./components/FileConfigReader.component");
const ENVConfigReader_component_1 = require("./components/ENVConfigReader.component");
class A_ConfigLoader extends a_concept_1.A_Container {
    prepare(polyfill) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = yield polyfill.fs();
            try {
                switch (true) {
                    case a_concept_1.A_Context.environment === 'server' && !!fs.existsSync(`${a_concept_1.A_Context.concept}.conf.json`):
                        this.reader = this.scope.resolve(FileConfigReader_component_1.FileConfigReader);
                        break;
                    case a_concept_1.A_Context.environment === 'server' && !fs.existsSync(`${a_concept_1.A_Context.concept}.conf.json`):
                        this.reader = this.scope.resolve(ENVConfigReader_component_1.ENVConfigReader);
                        break;
                    case a_concept_1.A_Context.environment === 'browser':
                        this.reader = this.scope.resolve(ENVConfigReader_component_1.ENVConfigReader);
                        break;
                    default:
                        throw new A_Config_error_1.A_ConfigError(A_Config_error_1.A_ConfigError.InitializationError, `Environment ${a_concept_1.A_Context.environment} is not supported`);
                }
            }
            catch (error) {
                if (error instanceof a_concept_1.A_ScopeError) {
                    throw new A_Config_error_1.A_ConfigError({
                        title: A_Config_error_1.A_ConfigError.InitializationError,
                        description: `Failed to initialize A_ConfigLoader. Reader not found for environment ${a_concept_1.A_Context.environment}`,
                        originalError: error,
                    });
                }
            }
        });
    }
    readVariables(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reader.inject(config);
        });
    }
}
exports.A_ConfigLoader = A_ConfigLoader;
__decorate([
    a_concept_1.A_Concept.Load(),
    __param(0, (0, a_concept_1.A_Inject)(A_Polyfill_component_1.A_Polyfill))
], A_ConfigLoader.prototype, "prepare", null);
__decorate([
    a_concept_1.A_Concept.Load({
        after: ['A_ConfigLoader.prepare']
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Config_context_1.A_Config))
], A_ConfigLoader.prototype, "readVariables", null);
//# sourceMappingURL=A-Config.container.js.map