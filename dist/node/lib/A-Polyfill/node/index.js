'use strict';

var ACryptoPolyfill = require('./A-Crypto-Polyfill');
var AFSPolyfill = require('./A-FS-Polyfill');
var AHttpsPolyfill = require('./A-Https-Polyfill');
var APathPolyfill = require('./A-Path-Polyfill');
var AProcessPolyfill = require('./A-Process-Polyfill');
var AUrlPolyfill = require('./A-Url-Polyfill');
var ABufferPolyfill = require('./A-Buffer-Polyfill');



Object.keys(ACryptoPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return ACryptoPolyfill[k]; }
	});
});
Object.keys(AFSPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return AFSPolyfill[k]; }
	});
});
Object.keys(AHttpsPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return AHttpsPolyfill[k]; }
	});
});
Object.keys(APathPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return APathPolyfill[k]; }
	});
});
Object.keys(AProcessPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return AProcessPolyfill[k]; }
	});
});
Object.keys(AUrlPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return AUrlPolyfill[k]; }
	});
});
Object.keys(ABufferPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return ABufferPolyfill[k]; }
	});
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map