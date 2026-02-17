import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_FormatterHelper } from '@adaas/a-concept';
import { A_ExecutionContext } from '@adaas/a-utils/a-execution';
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from './A-Config.constants';
import { A_ConfigError } from './A-Config.error';
import { A_Frame } from '@adaas/a-frame';

let A_Config = class extends A_ExecutionContext {
  constructor(config) {
    super("a-config");
    this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
      ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
      ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];
    this._strict = config.strict ?? false;
    this._configProperties = config.variables ?? [];
    for (const key in config.defaults) {
      this.set(
        A_FormatterHelper.toUpperSnakeCase(key),
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
      return super.get(A_FormatterHelper.toUpperSnakeCase(property));
    throw new A_ConfigError("Property not exists or not allowed to read");
  }
  set(property, value) {
    const array = Array.isArray(property) ? property : typeof property === "string" ? [{ property, value }] : Object.keys(property).map((key) => ({
      property: key,
      value: property[key]
    }));
    for (const { property: property2, value: value2 } of array) {
      super.set(A_FormatterHelper.toUpperSnakeCase(property2), value2);
    }
  }
};
A_Config = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-Config",
    description: "Configuration management context that provides structured access to application configuration variables, supporting defaults and strict mode for enhanced reliability. Default environment variables are included for comprehensive configuration handling."
  })
], A_Config);

export { A_Config };
//# sourceMappingURL=A-Config.context.mjs.map
//# sourceMappingURL=A-Config.context.mjs.map