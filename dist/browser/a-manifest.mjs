import { __decorateClass } from './chunk-EQQGB2QZ.mjs';
import { A_Error, A_Fragment, A_TypeGuards } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

var A_ManifestError = class extends A_Error {
};
A_ManifestError.ManifestInitializationError = "A-Manifest Initialization Error";

// src/lib/A-Manifest/classes/A-ManifestChecker.class.ts
var A_ManifestChecker = class {
  constructor(manifest, component, method, checkExclusion = false) {
    this.manifest = manifest;
    this.component = component;
    this.method = method;
    this.checkExclusion = checkExclusion;
  }
  for(target) {
    const result = this.manifest.internal_checkAccess({
      component: this.component,
      method: this.method,
      target
    });
    return this.checkExclusion ? !result : result;
  }
};
var A_Manifest = class extends A_Fragment {
  /**
   * A-Manifest is a configuration set that allows to include or exclude component application for the particular methods.
   *
   * For example, if A-Scope provides polymorphic A-Component that applies for All A-Entities in it but you have another component that should be used for only One particular Entity, you can use A-Manifest to specify this behavior.
   * 
   * 
   * By default if Component is provided in the scope - it applies for all entities in it. However, if you want to exclude some entities or include only some entities for the particular component - you can use A-Manifest to define this behavior.
   * 
   * @param config - Array of component configurations
   */
  constructor(config = []) {
    super({
      name: "A-Manifest"
    });
    this.rules = [];
    this.prepare(config);
  }
  /**
   * Should convert received configuration into internal Regexp applicable for internal storage
   */
  prepare(config) {
    if (!A_TypeGuards.isArray(config))
      throw new A_ManifestError(
        A_ManifestError.ManifestInitializationError,
        `A-Manifest configuration should be an array of configurations`
      );
    for (const item of config) {
      this.processConfigItem(item);
    }
  }
  /**
   * Process a single configuration item and convert it to internal rules
   */
  processConfigItem(item) {
    if (!A_TypeGuards.isComponentConstructor(item.component))
      throw new A_ManifestError(
        A_ManifestError.ManifestInitializationError,
        `A-Manifest configuration item should be a A-Component constructor`
      );
    const componentRegex = this.constructorToRegex(item.component);
    if (item.apply || item.exclude) {
      const methodRegex = /.*/;
      this.rules.push({
        componentRegex,
        methodRegex,
        applyRegex: item.apply ? this.allowedComponentsToRegex(item.apply) : void 0,
        excludeRegex: item.exclude ? this.allowedComponentsToRegex(item.exclude) : void 0
      });
    }
    if (item.methods && item.methods.length > 0) {
      for (const methodConfig of item.methods) {
        const methodRegex = this.methodToRegex(methodConfig.method);
        this.rules.push({
          componentRegex,
          methodRegex,
          applyRegex: methodConfig.apply ? this.allowedComponentsToRegex(methodConfig.apply) : void 0,
          excludeRegex: methodConfig.exclude ? this.allowedComponentsToRegex(methodConfig.exclude) : void 0
        });
      }
    }
  }
  /**
   * Convert a constructor to a regex pattern
   */
  constructorToRegex(ctor) {
    return new RegExp(`^${this.escapeRegex(ctor.name)}$`);
  }
  /**
   * Convert a method name or regex to a regex pattern
   */
  methodToRegex(method) {
    if (method instanceof RegExp) {
      return method;
    }
    return new RegExp(`^${this.escapeRegex(method)}$`);
  }
  /**
   * Convert allowed components array or regex to a single regex
   */
  allowedComponentsToRegex(components) {
    if (components instanceof RegExp) {
      return components;
    }
    const patterns = components.map((ctor) => this.escapeRegex(ctor.name));
    return new RegExp(`^(${patterns.join("|")})$`);
  }
  /**
   * Escape special regex characters in a string
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  configItemToRegexp(item) {
    return this.constructorToRegex(item);
  }
  ID(component, method) {
    return `${component.name}.${method}`;
  }
  /**
   * Check if a component and method combination is allowed for a target
   */
  isAllowed(ctor, method) {
    const componentCtor = typeof ctor === "function" ? ctor : ctor.constructor;
    return new A_ManifestChecker(this, componentCtor, method);
  }
  /**
   * Internal method to check if access is allowed
   */
  internal_checkAccess(query) {
    const componentName = query.component.name;
    const methodName = query.method;
    const targetName = query.target.name;
    const matchingRules = this.rules.filter(
      (rule) => rule.componentRegex.test(componentName) && rule.methodRegex.test(methodName)
    ).sort((a, b) => {
      const aIsGeneral = a.methodRegex.source === ".*";
      const bIsGeneral = b.methodRegex.source === ".*";
      if (aIsGeneral && !bIsGeneral) return 1;
      if (!aIsGeneral && bIsGeneral) return -1;
      return 0;
    });
    if (matchingRules.length === 0) {
      return true;
    }
    for (const rule of matchingRules) {
      if (rule.excludeRegex && rule.excludeRegex.test(targetName)) {
        return false;
      }
      if (rule.applyRegex) {
        return rule.applyRegex.test(targetName);
      }
    }
    return true;
  }
  isExcluded(ctor, method) {
    const componentCtor = typeof ctor === "function" ? ctor : ctor.constructor;
    return new A_ManifestChecker(this, componentCtor, method, true);
  }
};
A_Manifest = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-Manifest",
    description: "A-Manifest is a configuration fragment that allows to include or exclude component application for particular methods. It provides fine-grained control over which components are applied to which targets and methods within the application, enabling flexible and dynamic behavior based on defined rules."
  })
], A_Manifest);

export { A_Manifest, A_ManifestChecker, A_ManifestError };
//# sourceMappingURL=a-manifest.mjs.map
//# sourceMappingURL=a-manifest.mjs.map