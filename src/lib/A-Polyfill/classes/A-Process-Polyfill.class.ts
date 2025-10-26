import { A_Context } from "@adaas/a-concept";
import { IprocessInterface } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_ProcessPolyfillClass {
    private _process!: IprocessInterface;
    private _initialized: boolean = false;

    get isInitialized(): boolean {
        return this._initialized;
    }

    constructor(
        protected logger: A_Logger
    ) {

    }

    async get(): Promise<IprocessInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._process;
    }

    private async init(): Promise<void> {
        try {
            if (A_Context.environment === 'server') {
                this.initServer();
            } else {
                this.initBrowser();
            }
            this._initialized = true;
        } catch (error) {
            this.initBrowser();
            this._initialized = true;
        }
    }

    private initServer(): void {
        this._process = {
            env: process.env as Record<string, string>,
            argv: process.argv,
            platform: process.platform,
            version: process.version,
            versions: process.versions as Record<string, string>,
            cwd: process.cwd,
            exit: process.exit,
            nextTick: process.nextTick
        };
    }

    private initBrowser(): void {
        this._process = {
            env: {
                NODE_ENV: 'browser',
                ...((globalThis as any).process?.env || {})
            },
            argv: ['browser'],
            platform: 'browser',
            version: 'browser',
            versions: { node: 'browser' },
            cwd: () => '/',
            exit: (code?: number) => {
                this.logger.warning('process.exit not available in browser');
                throw new Error(`Process exit with code ${code}`);
            },
            nextTick: (callback: Function, ...args: any[]) => {
                setTimeout(() => callback(...args), 0);
            }
        };
    }
}