import { A_Component, A_Error, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_Config } from "../A-Config/A-Config.context";



export class A_Logger extends A_Component {

    constructor(
        @A_Inject(A_Scope) protected scope: A_Scope,
        @A_Inject(A_Config) protected config: A_Config
    ) {
        super();
    }

    readonly colors = {
        green: '32',
        blue: '34',
        red: '31',
        yellow: '33',
        gray: '90',
        magenta: '35',
        cyan: '36',
        white: '37',
        pink: '95',
    } as const


    get scopeLength() {
        return this.scope.name.length;
    }


    compile(
        color: keyof typeof this.colors,
        ...args: any[]
    ): Array<string> {

        return [
            `\x1b[${this.colors[color]}m[${this.scope.name}] |${this.getTime()}|`,
            (
                args.length > 1
                    ? '\n' + `${' '.repeat(this.scopeLength + 3)}|-------------------------------`
                    : ''

            ),
            ...(args
                .map((arg, i) => {


                    switch (true) {
                        case arg instanceof A_Error:
                            return this.compile_A_Error(arg);

                        case arg instanceof Error:
                            return this.compile_Error(arg);

                        case typeof arg === 'object':
                            return JSON.stringify(arg, null, 2)
                                .replace(/\n/g, '\n' + `${' '.repeat(this.scopeLength + 3)}| `);

                        default:
                            return String(
                                ((i > 0 || args.length > 1) ? '\n' : '')
                                + arg)
                                .replace(/\n/g, '\n' + `${' '.repeat(this.scopeLength + 3)}| `)
                    }
                })),
            (
                args.length > 1
                    ? '\n' + `${' '.repeat(this.scopeLength + 3)}|-------------------------------\x1b[0m`
                    : '\x1b[0m'
            )
        ]
    }

    protected get allowedToLog() {
        return this.config.get('CONFIG_VERBOSE') !== undefined
            && this.config.get('CONFIG_VERBOSE') !== 'false'
            && this.config.get('CONFIG_VERBOSE') !== false
    }


    log(
        color: keyof typeof this.colors,
        ...args: any[]
    )
    log(
        ...args: any[]
    )
    log(
        param1: any,
        ...args: any[]
    ) {
        if (!this.allowedToLog)
            return;

        if (typeof param1 === 'string' && this.colors[param1]) {
            console.log(...this.compile(param1 as keyof typeof this.colors, ...args));
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


    protected log_A_Error(error: A_Error) {
        const time = this.getTime();

        console.log(`\x1b[31m[${this.scope.name}] |${time}| ERROR ${error.code}
${' '.repeat(this.scopeLength + 3)}| ${error.message}
${' '.repeat(this.scopeLength + 3)}| ${error.description} 
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${error.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
\x1b[0m`
            + (error.originalError ? `\x1b[31m${' '.repeat(this.scopeLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${error.originalError.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
\x1b[0m`: '')
            + (error.link ? `\x1b[31m${' '.repeat(this.scopeLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
\x1b[0m`: ''));

    }

    protected compile_A_Error(error: A_Error): string {
        const time = this.getTime();

        return '\n' +

            `${' '.repeat(this.scopeLength + 3)}|-------------------------------` +
            '\n' +
            `${' '.repeat(this.scopeLength + 3)}|  Error:  | ${error.code}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}|${' '.repeat(10)}| ${error.message}
${' '.repeat(this.scopeLength + 3)}|${' '.repeat(10)}| ${error.description} 
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${error.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------`
            +
            (error.originalError ? `${' '.repeat(this.scopeLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${error.originalError.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.scopeLength + 3)}|-------------------------------` : '')
            +
            (error.link ? `${' '.repeat(this.scopeLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.scopeLength + 3)}|-------------------------------` : '');

    }


    protected compile_Error(error: Error): string {
        return JSON.stringify({
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n')
                .map((line, index) => index === 0 ? line : `${' '.repeat(this.scopeLength + 3)}| ${line}`)
                .join('\n')

        }, null, 2)
            .replace(/\n/g, '\n' + `${' '.repeat(this.scopeLength + 3)}| `)
            .replace(/\\n/g, '\n')
    }



    protected getTime() {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(4, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }
}