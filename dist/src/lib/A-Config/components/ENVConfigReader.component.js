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
exports.ENVConfigReader = void 0;
const a_concept_1 = require("@adaas/a-concept");
const ConfigReader_component_1 = require("./ConfigReader.component");
const A_Config_context_1 = require("../A-Config.context");
const A_Polyfill_component_1 = require("../../A-Polyfill/A-Polyfill.component");
class ENVConfigReader extends ConfigReader_component_1.ConfigReader {
    readEnvFile(config, polyfill, feature) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = yield polyfill.fs();
            if (fs.existsSync('.env'))
                fs.readFileSync(`${config.get('A_CONCEPT_ROOT_FOLDER')}/.env`, 'utf-8').split('\n').forEach(line => {
                    const [key, value] = line.split('=');
                    if (key && value) {
                        process.env[key.trim()] = value.trim();
                    }
                });
        });
    }
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_ENV_Alias(property) {
        return a_concept_1.A_FormatterHelper.toUpperSnakeCase(property);
    }
    resolve(property) {
        return process.env[this.getConfigurationProperty_ENV_Alias(property)];
    }
    read() {
        return __awaiter(this, arguments, void 0, function* (variables = []) {
            const allVariables = [
                ...variables,
                ...Object.keys(process.env),
            ];
            const config = {};
            allVariables.forEach(variable => {
                config[variable] = this.resolve(variable);
            });
            return config;
        });
    }
}
exports.ENVConfigReader = ENVConfigReader;
__decorate([
    a_concept_1.A_Concept.Load({
        before: ['ENVConfigReader.initialize']
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Config_context_1.A_Config)),
    __param(1, (0, a_concept_1.A_Inject)(A_Polyfill_component_1.A_Polyfill)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Feature))
], ENVConfigReader.prototype, "readEnvFile", null);
//# sourceMappingURL=ENVConfigReader.component.js.map