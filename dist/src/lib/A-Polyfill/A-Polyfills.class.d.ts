import { IcryptoInterface, Ifspolyfill } from "./A-Polyfill.types";
export declare class A_PolyfillClass {
    private _fs;
    private _crypto;
    private fsName;
    private cryptoName;
    fs(): Promise<Ifspolyfill>;
    crypto(): Promise<IcryptoInterface>;
    get env(): 'server' | 'browser';
    private init;
}
