"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Polyfills = void 0;
class A_PolyfillsClass {
    constructor() {
        // eslint-disable-next-line no-use-before-define
        this.fsName = 'fs';
        this.cryptoName = 'crypto';
    }
    fs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._fs) {
                yield this.init();
            }
            return this._fs;
        });
    }
    crypto() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._crypto) {
                yield this.init();
            }
            return this._crypto;
        });
    }
    get env() {
        let testEnvironment = 'browser';
        try {
            testEnvironment = window.location ? 'browser' : 'server';
        }
        catch (error) {
            testEnvironment = 'server';
        }
        return testEnvironment;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.env === 'server') {
                    // eslint-disable-next-line no-use-before-define
                    this._fs = (yield Promise.resolve(`${'' + this.fsName}`).then(s => __importStar(require(s))));
                    // eslint-disable-next-line no-use-before-define
                    this._crypto = {
                        createTextHash: () => Promise.resolve(''),
                        createFileHash: (filePath, algorithm = 'sha384') => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                const crypto = yield Promise.resolve(`${'' + this.cryptoName}`).then(s => __importStar(require(s)));
                                const hash = crypto.createHash(algorithm);
                                const fileStream = this._fs.createReadStream(filePath);
                                fileStream.on('data', (data) => hash.update(data));
                                fileStream.on('end', () => resolve(`${algorithm}-${hash.digest('base64')}`));
                                fileStream.on('error', (err) => reject(err));
                            }
                            catch (error) {
                                return reject(error);
                            }
                        }))
                    };
                }
                else {
                    throw new Error('Not Server Environment');
                }
            }
            catch (error) {
                this._fs = {
                    readFileSync: (path, encoding) => '',
                    existsSync: (path) => false,
                    createReadStream: (path) => ''
                };
                this._crypto = {
                    createFileHash: () => Promise.resolve(''),
                    createTextHash: (text, algorithm = 'SHA-384') => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const encoder = new TextEncoder();
                            const data = encoder.encode(text);
                            const hashBuffer = yield crypto.subtle.digest(algorithm, data);
                            const hashArray = Array.from(new Uint8Array(hashBuffer));
                            const hashBase64 = btoa(String.fromCharCode(...hashArray.map(byte => String.fromCharCode(byte))));
                            return resolve(`${algorithm}-${hashBase64}`);
                        }
                        catch (error) {
                            return reject(error);
                        }
                    }))
                };
            }
        });
    }
}
exports.A_Polyfills = new A_PolyfillsClass();
//# sourceMappingURL=A_Polyfills.js.map