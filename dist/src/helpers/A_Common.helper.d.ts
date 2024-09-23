import { A_TYPES__DeepPartial } from "../types/A_Common.types";
export declare class A_CommonHelper {
    static resolve(): Promise<undefined>;
    static omitArrayProperties<T, S extends string>(array: Array<T>, fields: string[]): Omit<T, S>[];
    static sanitizeHTML(html: string): string;
    /**
     *  Omit properties from an object or array with nested objects
     *
     * @param input
     * @param paths
     * @returns
     */
    static omitProperties<T, S extends string>(input: T, paths: string[]): Omit<T, S>;
    /**
     *  Format a number with leading zeros to a fixed length
     *
     * @param number
     * @param maxZeros
     * @returns
     */
    static formatWithLeadingZeros(number: any, maxZeros?: number): string;
    /**
     * Remove leading zeros from a formatted number
     */
    static removeLeadingZeros(formattedNumber: any): string;
    static toUpperSnakeCase(str: string): string;
    static toCamelCase(str: string): string;
    static isObject(item: any): boolean;
    static deepMerge<T = any>(target: any, source: any, visited?: Map<any, any>): T;
    static deepClone<T>(target: T): T;
    static deepCloneAndMerge<T>(target: A_TYPES__DeepPartial<T>, source: T): T;
}
