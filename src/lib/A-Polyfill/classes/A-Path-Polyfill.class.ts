import { A_Context } from "@adaas/a-concept";
import { IpathInterface } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_PathPolyfillClass {
    private _path!: IpathInterface;
    private _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {

    }

    get isInitialized(): boolean {
        return this._initialized;
    }


    async get(): Promise<IpathInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._path;
    }

    private async init(): Promise<void> {
        try {
            if (A_Context.environment === 'server') {
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
        this._path = await import('path') as IpathInterface;
    }

    private initBrowser(): void {
        this._path = {
            join: (...paths: string[]) => {
                return paths.join('/').replace(/\/+/g, '/');
            },
            resolve: (...paths: string[]) => {
                let resolvedPath = '';
                for (const path of paths) {
                    if (path.startsWith('/')) {
                        resolvedPath = path;
                    } else {
                        resolvedPath = this._path.join(resolvedPath, path);
                    }
                }
                return resolvedPath || '/';
            },
            dirname: (path: string) => {
                const parts = path.split('/');
                return parts.slice(0, -1).join('/') || '/';
            },
            basename: (path: string, ext?: string) => {
                const base = path.split('/').pop() || '';
                return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base;
            },
            extname: (path: string) => {
                const parts = path.split('.');
                return parts.length > 1 ? '.' + parts.pop() : '';
            },
            relative: (from: string, to: string) => {
                // Simplified relative path calculation
                return to.replace(from, '').replace(/^\//, '');
            },
            normalize: (path: string) => {
                return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
            },
            isAbsolute: (path: string) => {
                return path.startsWith('/') || /^[a-zA-Z]:/.test(path);
            },
            parse: (path: string) => {
                const ext = this._path.extname(path);
                const base = this._path.basename(path);
                const name = this._path.basename(path, ext);
                const dir = this._path.dirname(path);
                return { root: '/', dir, base, ext, name };
            },
            format: (pathObject: any) => {
                return this._path.join(pathObject.dir || '', pathObject.base || '');
            },
            sep: '/',
            delimiter: ':'
        };
    }
}