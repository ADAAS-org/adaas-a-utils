'use strict';

var aConcept = require('@adaas/a-concept');
var aExecution = require('@adaas/a-utils/a-execution');
var AConfig_constants = require('./A-Config.constants');
var AConfig_error = require('./A-Config.error');
var aFrame = require('@adaas/a-frame');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_Config = class A_Config extends aExecution.A_ExecutionContext {
  constructor(config) {
    super("a-config");
    this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
      ...aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
      ...AConfig_constants.A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];
    this._strict = config.strict ?? false;
    this._configProperties = config.variables ?? [];
    for (const key in config.defaults) {
      this.set(
        aConcept.A_FormatterHelper.toUpperSnakeCase(key),
        config.defaults[key]
      );
    }
  }
  get strict() {
    return this._strict;
  }
  /** 
    * This method is used to get the configuration property by name
    * 
    * @param property 
    * @returns 
    */
  get(property) {
    if (this._configProperties.includes(property) || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property) || !this._strict)
      return super.get(aConcept.A_FormatterHelper.toUpperSnakeCase(property));
    throw new AConfig_error.A_ConfigError("Property not exists or not allowed to read");
  }
  set(property, value) {
    const array = Array.isArray(property) ? property : typeof property === "string" ? [{ property, value }] : Object.keys(property).map((key) => ({
      property: key,
      value: property[key]
    }));
    for (const { property: property2, value: value2 } of array) {
      super.set(aConcept.A_FormatterHelper.toUpperSnakeCase(property2), value2);
    }
  }
};
exports.A_Config = __decorateClass([
  aFrame.A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-Config",
    description: "Configuration management context that provides structured access to application configuration variables, supporting defaults and strict mode for enhanced reliability. Default environment variables are included for comprehensive configuration handling."
  })
], exports.A_Config);
//# sourceMappingURL=A-Config.context.js.map
//# sourceMappingURL=A-Config.context.js.map