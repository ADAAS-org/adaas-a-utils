import { A_Context } from "@adaas/a-concept";
import { Ifspolyfill } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_FSPolyfillClass {
    private _fs!: Ifspolyfill;
    private _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {

    }

    get isInitialized(): boolean {
        return this._initialized;
    }


    async get(): Promise<Ifspolyfill> {
        if (!this._initialized) {
            await this.init();
        }
        return this._fs;
    }

    private async init(): Promise<void> {
        try {
            if (A_Context.environment=== 'server') {
                await this.initServer();
            } else {
                this.initBrowser();
            }
            this._initialized = true;
        } catch (error) {
            this.initBrowser();
            this._initialized = true;
        }
    }

    private async initServer(): Promise<void> {
        this._fs = await import('fs') as Ifspolyfill;
    }

    private initBrowser(): void {
        this._fs = {
            readFileSync: (path: string, encoding: string) => {
                this.logger.warning('fs.readFileSync not available in browser environment');
                return '';
            },
            existsSync: (path: string) => {
                this.logger.warning('fs.existsSync not available in browser environment');
                return false;
            },
            createReadStream: (path: string) => {
                this.logger.warning('fs.createReadStream not available in browser environment');
                return null;
            }
        };
    }
}