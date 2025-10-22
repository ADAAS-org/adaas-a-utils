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
exports.ENVConfigReader = void 0;
const a_concept_1 = require("@adaas/a-concept");
const ConfigReader_component_1 = require("./ConfigReader.component");
class ENVConfigReader extends ConfigReader_component_1.ConfigReader {
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
            const config = {};
            variables.forEach(variable => {
                config[variable] = this.resolve(variable);
            });
            return config;
        });
    }
}
exports.ENVConfigReader = ENVConfigReader;
//# sourceMappingURL=ENVConfigReader.component.js.map