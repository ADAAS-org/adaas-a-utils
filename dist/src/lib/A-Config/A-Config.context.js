"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Config = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Config_constants_1 = require("./A-Config.constants");
class A_Config extends a_concept_1.A_Fragment {
    constructor(config) {
        super({
            name: 'A_Config'
        });
        this.VARIABLES = new Map();
        this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
            ...a_concept_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
            ...A_Config_constants_1.A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
        ];
        this.config = a_concept_1.A_CommonHelper.deepCloneAndMerge(config, {
            strict: false,
            defaults: {},
            variables: a_concept_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY
        });
        this.CONFIG_PROPERTIES = this.config.variables ? this.config.variables : [];
        this.config.variables.forEach((variable) => {
            this.VARIABLES.set(a_concept_1.A_FormatterHelper.toUpperSnakeCase(variable), this.config.defaults[variable]);
        });
    }
    /**
     * This method is used to get the configuration property by name
     *
     * @param property
     * @returns
     */
    get(property) {
        if (this.CONFIG_PROPERTIES.includes(property)
            || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property)
            || !(this.config.strict))
            return this.VARIABLES.get(a_concept_1.A_FormatterHelper.toUpperSnakeCase(property));
        throw new Error('Property not exists or not allowed to read');
        // return this.concept.Errors.throw(A_SDK_CONSTANTS__ERROR_CODES.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ) as never;
    }
    set(property, value) {
        var _a;
        const array = Array.isArray(property)
            ? property
            : typeof property === 'string'
                ? [{ property, value }]
                : Object
                    .keys(property)
                    .map((key) => ({
                    property: key,
                    value: property[key]
                }));
        for (const { property, value } of array) {
            let targetValue = value
                ? value
                : ((_a = this.config) === null || _a === void 0 ? void 0 : _a.defaults)
                    ? this.config.defaults[property]
                    : undefined;
            this.VARIABLES.set(a_concept_1.A_FormatterHelper.toUpperSnakeCase(property), targetValue);
        }
    }
}
exports.A_Config = A_Config;
//# sourceMappingURL=A-Config.context.js.map