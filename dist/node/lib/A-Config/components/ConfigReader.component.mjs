import { __decorateClass, __decorateParam } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Container, A_Scope, A_Dependency, A_Component, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_CONCEPT_ENV } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';
import { A_Config } from '../A-Config.context';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from '../A-Config.constants';

let ConfigReader = class extends A_Component {
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

export { ConfigReader };
//# sourceMappingURL=ConfigReader.component.mjs.map
//# sourceMappingURL=ConfigReader.component.mjs.map