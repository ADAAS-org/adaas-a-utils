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
exports.ConfigReader = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Config_context_1 = require("../A-Config.context");
const A_Config_constants_1 = require("../A-Config.constants");
const A_Polyfill_component_1 = require("../../A-Polyfill/A-Polyfill.component");
/**
 * Config Reader
 */
let ConfigReader = class ConfigReader extends a_concept_1.A_Component {
    constructor(polyfill) {
        super();
        this.polyfill = polyfill;
    }
    attachContext(container, feature) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!container.scope.has(A_Config_context_1.A_Config)) {
                const newConfig = new A_Config_context_1.A_Config({
                    variables: [
                        ...a_concept_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
                        ...A_Config_constants_1.A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
                    ],
                    defaults: {}
                });
                container.scope.register(newConfig);
            }
            const config = container.scope.resolve(A_Config_context_1.A_Config);
            const rootDir = yield this.getProjectRoot();
            config.set('A_CONCEPT_ROOT_FOLDER', rootDir);
        });
    }
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.read([
                ...config.CONFIG_PROPERTIES,
                ...a_concept_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
                ...A_Config_constants_1.A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
            ]);
            config.set(data);
        });
    }
    /**
     * Get the configuration property by Name
     * @param property
     */
    resolve(property) {
        return property;
    }
    /**
     * This method reads the configuration and sets the values to the context
     *
     * @returns
     */
    read() {
        return __awaiter(this, arguments, void 0, function* (variables = []) {
            return {};
        });
    }
    /**
     * Finds the root directory of the project by locating the folder containing package.json
     *
     * @param {string} startPath - The initial directory to start searching from (default is __dirname)
     * @returns {string|null} - The path to the root directory or null if package.json is not found
     */
    getProjectRoot() {
        return __awaiter(this, arguments, void 0, function* (startPath = __dirname) {
            return process.cwd();
        });
    }
};
exports.ConfigReader = ConfigReader;
__decorate([
    a_concept_1.A_Concept.Load(),
    __param(0, (0, a_concept_1.A_Inject)(a_concept_1.A_Container)),
    __param(1, (0, a_concept_1.A_Inject)(a_concept_1.A_Feature))
], ConfigReader.prototype, "attachContext", null);
__decorate([
    a_concept_1.A_Concept.Load(),
    __param(0, (0, a_concept_1.A_Inject)(A_Config_context_1.A_Config))
], ConfigReader.prototype, "initialize", null);
exports.ConfigReader = ConfigReader = __decorate([
    __param(0, (0, a_concept_1.A_Inject)(A_Polyfill_component_1.A_Polyfill))
], ConfigReader);
//# sourceMappingURL=ConfigReader.component.js.map