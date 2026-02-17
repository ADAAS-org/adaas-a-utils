'use strict';

var ALogger_component = require('./A-Logger.component');
var ALogger_types = require('./A-Logger.types');
var ALogger_constants = require('./A-Logger.constants');
var ALogger_env = require('./A-Logger.env');



Object.keys(ALogger_component).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return ALogger_component[k]; }
	});
});
Object.keys(ALogger_types).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return ALogger_types[k]; }
	});
});
Object.keys(ALogger_constants).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return ALogger_constants[k]; }
	});
});
Object.keys(ALogger_env).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return ALogger_env[k]; }
	});
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map