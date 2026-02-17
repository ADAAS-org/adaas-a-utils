import { A_Polyfill } from './chunk-J6CLHXFQ.mjs';
import { A_ExecutionContext } from './chunk-TQ5UON22.mjs';
import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Container, A_Scope, A_Dependency, A_Feature, A_Error, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_FormatterHelper, A_Component, A_CONCEPT_ENV, A_Context, A_ScopeError } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

// src/lib/A-Config/A-Config.constants.ts
var A_CONSTANTS__CONFIG_ENV_VARIABLES = {};
var A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY = [];
var A_ConfigError = class extends A_Error {
};
A_ConfigError.InitializationError = "A-Config Initialization Error";
var A_Config = class extends A_ExecutionContext {
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
var ConfigReader = class extends A_Component {
  constructor(polyfill) {
    super();
    this.polyfill = polyfill;
    this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
      ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
      ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];
  }
  async attachContext(container, context, config) {
    if (!config) {
      config = new A_Config({
        defaults: {}
      });
      container.scope.register(config);
    }
    config.set("A_CONCEPT_ROOT_FOLDER", A_CONCEPT_ENV.A_CONCEPT_ROOT_FOLDER);
  }
  async initialize(config) {
    const data = await this.read();
    for (const key in data) {
      config.set(key, data[key]);
    }
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
  async read(variables = []) {
    return {};
  }
};
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Container)),
  __decorateParam(1, A_Inject(A_Scope)),
  __decorateParam(2, A_Inject(A_Config))
], ConfigReader.prototype, "attachContext", 1);
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_Config))
], ConfigReader.prototype, "initialize", 1);
ConfigReader = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "ConfigReader",
    description: "Abstract component for reading configuration data from various sources such as files, environment variables, or remote services. This component can be extended to implement specific configuration reading strategies."
  }),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_Polyfill))
], ConfigReader);
var FileConfigReader = class extends ConfigReader {
  constructor() {
    super(...arguments);
    this.FileData = /* @__PURE__ */ new Map();
  }
  /**
   * Get the configuration property Name
   * @param property 
   */
  getConfigurationProperty_File_Alias(property) {
    return A_FormatterHelper.toCamelCase(property);
  }
  resolve(property) {
    return this.FileData.get(this.getConfigurationProperty_File_Alias(property));
  }
  async read(variables) {
    const fs = await this.polyfill.fs();
    try {
      const data = fs.readFileSync(`${A_Context.concept}.conf.json`, "utf8");
      const config = JSON.parse(data);
      this.FileData = new Map(Object.entries(config));
      return config;
    } catch (error) {
      return {};
    }
  }
};
FileConfigReader = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "FileConfigReader",
    description: "Configuration reader that loads configuration data from a JSON file located in the application root directory. It reads the file named after the current concept with a .conf.json extension and parses its contents into the configuration context."
  })
], FileConfigReader);
var ENVConfigReader = class extends ConfigReader {
  async readEnvFile(config, polyfill, feature) {
    const fs = await polyfill.fs();
    if (fs.existsSync(".env"))
      fs.readFileSync(`${config.get("A_CONCEPT_ROOT_FOLDER")}/.env`, "utf-8").split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          A_CONCEPT_ENV.set(key.trim(), value.trim());
        }
      });
  }
  /**
   * Get the configuration property Name 
   * @param property 
   */
  getConfigurationProperty_ENV_Alias(property) {
    return A_FormatterHelper.toUpperSnakeCase(property);
  }
  resolve(property) {
    return A_CONCEPT_ENV.get(this.getConfigurationProperty_ENV_Alias(property));
  }
  async read(variables = []) {
    const allVariables = [
      ...variables,
      ...A_CONCEPT_ENV.getAllKeys()
    ];
    const config = {};
    allVariables.forEach((variable) => {
      config[variable] = this.resolve(variable);
    });
    return config;
  }
};
__decorateClass([
  A_Concept.Load({
    before: ["ENVConfigReader.initialize"]
  }),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_Polyfill)),
  __decorateParam(2, A_Inject(A_Feature))
], ENVConfigReader.prototype, "readEnvFile", 1);
ENVConfigReader = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "ENVConfigReader",
    description: "Configuration reader that sources configuration data from environment variables. It supports loading variables from a .env file and maps them to the configuration context, making it suitable for applications running in diverse environments such as local development, staging, and production."
  })
], ENVConfigReader);
var A_ConfigLoader = class extends A_Container {
  async prepare(polyfill) {
    if (!this.scope.has(A_Config)) {
      const newConfig = new A_Config({
        variables: [
          ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
          ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
        ],
        defaults: {}
      });
      this.scope.register(newConfig);
    }
    const fs = await polyfill.fs();
    try {
      switch (true) {
        case (A_Context.environment === "server" && !!fs.existsSync(`${A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(FileConfigReader);
          break;
        case (A_Context.environment === "server" && !fs.existsSync(`${A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(ENVConfigReader);
          break;
        case A_Context.environment === "browser":
          this.reader = this.scope.resolve(ENVConfigReader);
          break;
        default:
          throw new A_ConfigError(
            A_ConfigError.InitializationError,
            `Environment ${A_Context.environment} is not supported`
          );
      }
    } catch (error) {
      if (error instanceof A_ScopeError) {
        throw new A_ConfigError({
          title: A_ConfigError.InitializationError,
          description: `Failed to initialize A_ConfigLoader. Reader not found for environment ${A_Context.environment}`,
          originalError: error
        });
      }
    }
  }
};
__decorateClass([
  A_Concept.Load({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Polyfill))
], A_ConfigLoader.prototype, "prepare", 1);
A_ConfigLoader = __decorateClass([
  A_Frame.Container({
    namespace: "A-Utils",
    name: "A-ConfigLoader",
    description: "Container responsible for loading and initializing the A_Config component based on the environment and available configuration sources. It can be useful for application that need a separated configuration management and sharable across multiple containers."
  })
], A_ConfigLoader);

// src/lib/A-Config/A-Config.types.ts
var A_TYPES__ConfigFeature = /* @__PURE__ */ ((A_TYPES__ConfigFeature2) => {
  return A_TYPES__ConfigFeature2;
})(A_TYPES__ConfigFeature || {});

export { A_CONSTANTS__CONFIG_ENV_VARIABLES, A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY, A_Config, A_ConfigError, A_ConfigLoader, A_TYPES__ConfigFeature, ConfigReader, ENVConfigReader, FileConfigReader };
//# sourceMappingURL=chunk-ECSGFDRQ.mjs.map
//# sourceMappingURL=chunk-ECSGFDRQ.mjs.map