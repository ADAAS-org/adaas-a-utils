import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_FormatterHelper, A_Context } from '@adaas/a-concept';
import { ConfigReader } from './ConfigReader.component';
import { A_Frame } from '@adaas/a-frame';

let FileConfigReader = class extends ConfigReader {
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

export { FileConfigReader };
//# sourceMappingURL=FileConfigReader.component.mjs.map
//# sourceMappingURL=FileConfigReader.component.mjs.map