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
exports.FileConfigReader = void 0;
const a_concept_1 = require("@adaas/a-concept");
const ConfigReader_component_1 = require("./ConfigReader.component");
class FileConfigReader extends ConfigReader_component_1.ConfigReader {
    constructor() {
        super(...arguments);
        this.FileData = new Map();
    }
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_File_Alias(property) {
        return a_concept_1.A_FormatterHelper.toCamelCase(property);
    }
    resolve(property) {
        return this.FileData.get(this.getConfigurationProperty_File_Alias(property));
    }
    read(variables) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = yield this.polyfill.fs();
            try {
                const data = fs.readFileSync(`${a_concept_1.A_Context.concept}.conf.json`, 'utf8');
                const config = JSON.parse(data);
                this.FileData = new Map(Object.entries(config));
                return config;
            }
            catch (error) {
                // this.context.Logger.error(error);
                return {};
            }
        });
    }
}
exports.FileConfigReader = FileConfigReader;
//# sourceMappingURL=FileConfigReader.component.js.map