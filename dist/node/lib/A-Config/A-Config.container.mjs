import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Container, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_Context, A_ScopeError } from '@adaas/a-concept';
import { A_Config } from './A-Config.context';
import { A_ConfigError } from './A-Config.error';
import { FileConfigReader } from './components/FileConfigReader.component';
import { ENVConfigReader } from './components/ENVConfigReader.component';
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from './A-Config.constants';
import { A_Frame } from '@adaas/a-frame';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';

let A_ConfigLoader = class extends A_Container {
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

export { A_ConfigLoader };
//# sourceMappingURL=A-Config.container.mjs.map
//# sourceMappingURL=A-Config.container.mjs.map