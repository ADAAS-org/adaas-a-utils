'use strict';

class A_ManifestChecker {
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
}

exports.A_ManifestChecker = A_ManifestChecker;
//# sourceMappingURL=A-ManifestChecker.class.js.map
//# sourceMappingURL=A-ManifestChecker.class.js.map