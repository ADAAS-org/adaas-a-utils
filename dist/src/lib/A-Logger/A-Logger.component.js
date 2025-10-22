"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Logger = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Config_context_1 = require("../A-Config/A-Config.context");
let A_Logger = class A_Logger extends a_concept_1.A_Component {
    constructor(scope, config) {
        super();
        this.scope = scope;
        this.config = config;
        this.colors = {
            green: '32',
            blue: '34',
            red: '31',
            yellow: '33',
            gray: '90',
            magenta: '35',
            cyan: '36',
            white: '37',
            pink: '95',
        };
    }
    get scopeLength() {
        return this.scope.name.length;
    }
    compile(color, ...args) {
        return [
            `\x1b[${this.colors[color]}m[${this.scope.name}] |${this.getTime()}|`,
            (args.length > 1
                ? '\n' + `${' '.repeat(this.scopeLength + 3)}|-------------------------------`
                : ''),
            ...(args
                .map((arg, i) => {
                switch (true) {
                    case arg instanceof a_concept_1.A_Error:
                        return this.compile_A_Error(arg);
                    case arg instanceof Error:
                        return this.compile_Error(arg);
                    case typeof arg === 'object':
                        return JSON.stringify(arg, null, 2)
                            .replace(/\n/g, '\n' + `${' '.repeat(this.scopeLength + 3)}| `);
                    default:
                        return String(((i > 0 || args.length > 1) ? '\n' : '')
                            + arg)
                            .replace(/\n/g, '\n' + `${' '.repeat(this.scopeLength + 3)}| `);
                }
            })),
            (args.length > 1
                ? '\n' + `${' '.repeat(this.scopeLength + 3)}|-------------------------------\x1b[0m`
                : '\x1b[0m')
        ];
    }
    get allowedToLog() {
        return this.config.get('CONFIG_VERBOSE') !== undefined
            && this.config.get('CONFIG_VERBOSE') !== 'false'
            && this.config.get('CONFIG_VERBOSE') !== false;
    }
    log(param1, ...args) {
        if (!this.allowedToLog)
            return;
        if (typeof param1 === 'string' && this.colors[param1]) {
            console.log(...this.compile(param1, ...args));
            return;
        }
        else {
            console.log(...this.compile('blue', param1, ...args));
        }
    }
    warning(...args) {
        if (!this.allowedToLog)
            return;
        console.log(...this.compile('yellow', ...args));
    }
    error(...args) {
        if (this.config.get('CONFIG_IGNORE_ERRORS'))
            return;
        return console.log(...this.compile('red', ...args));
    }
    log_A_Error(error) {
        var _a, _b;
        const time = this.getTime();
        console.log(`\x1b[31m[${this.scope.name}] |${time}| ERROR ${error.code}
${' '.repeat(this.scopeLength + 3)}| ${error.message}
${' '.repeat(this.scopeLength + 3)}| ${error.description} 
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${((_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
\x1b[0m`
            + (error.originalError ? `\x1b[31m${' '.repeat(this.scopeLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${((_b = error.originalError.stack) === null || _b === void 0 ? void 0 : _b.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
\x1b[0m` : '')
            + (error.link ? `\x1b[31m${' '.repeat(this.scopeLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
\x1b[0m` : ''));
    }
    compile_A_Error(error) {
        var _a, _b;
        const time = this.getTime();
        return '\n' +
            `${' '.repeat(this.scopeLength + 3)}|-------------------------------` +
            '\n' +
            `${' '.repeat(this.scopeLength + 3)}|  Error:  | ${error.code}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}|${' '.repeat(10)}| ${error.message}
${' '.repeat(this.scopeLength + 3)}|${' '.repeat(10)}| ${error.description} 
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${((_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------`
            +
                (error.originalError ? `${' '.repeat(this.scopeLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${((_b = error.originalError.stack) === null || _b === void 0 ? void 0 : _b.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------` : '')
            +
                (error.link ? `${' '.repeat(this.scopeLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.scopeLength + 3)}|-------------------------------` : '');
    }
    compile_Error(error) {
        var _a;
        return JSON.stringify({
            name: error.name,
            message: error.message,
            stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n')
        }, null, 2)
            .replace(/\n/g, '\n' + `${' '.repeat(this.scopeLength + 3)}| `)
            .replace(/\\n/g, '\n');
    }
    getTime() {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(4, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }
};
exports.A_Logger = A_Logger;
exports.A_Logger = A_Logger = __decorate([
    __param(0, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope)),
    __param(1, (0, a_concept_1.A_Inject)(A_Config_context_1.A_Config))
], A_Logger);
//# sourceMappingURL=A-Logger.component.js.map