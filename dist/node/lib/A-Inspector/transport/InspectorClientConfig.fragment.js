'use strict';

var aConcept = require('@adaas/a-concept');

class InspectorClientConfig extends aConcept.A_Fragment {
  constructor(options) {
    super({ name: "InspectorClientConfig" });
    this.host = options.host;
    this.port = options.port;
    this.secret = options.secret;
    this.timeout = options.timeout ?? 1e4;
  }
}

exports.InspectorClientConfig = InspectorClientConfig;
//# sourceMappingURL=InspectorClientConfig.fragment.js.map
//# sourceMappingURL=InspectorClientConfig.fragment.js.map