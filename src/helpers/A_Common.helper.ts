import { A_TYPES__DeepPartial } from "../types/A_Common.types";

export class A_CommonHelper {

    static resolve() {
        return new Promise<undefined>((resolve) => resolve(undefined));
    }

    static omitArrayProperties<T, S extends string>(array: Array<T>, fields: string[]): Omit<T, S>[] {

        return array;
    }

    static sanitizeHTML(html: string): string {
        // Define the regular expression pattern to match all tags except <span>
        const regex = /<(?!\/?span(?=>|\s.*>))\/?.*?>/g;

        // Replace all matched tags with an empty string
        return html.replace(regex, '');
    }




    /**
     * Check if a class is inherited from another class
     * 
     * @param childClass 
     * @param parentClass 
     * @returns 
     */
    static isInheritedFrom(childClass: any, parentClass: any): boolean {
        let current = childClass;

        // Traverse the prototype chain
        while (current) {
            if (current === parentClass) {
                return true;
            }
            current = Object.getPrototypeOf(current);
        }
        return false;
    }


    /**
     *  Omit properties from an object or array with nested objects
     * 
     * @param input 
     * @param paths 
     * @returns 
     */
    static omitProperties<T, S extends string>(
        input: T,
        paths: string[]

    ): Omit<T, S> {

        // Deep clone the input object or array
        const result = JSON.parse(JSON.stringify(input));

        // Helper function to recursively remove properties
        function removeProperties(target: Record<string, any> | any[], currPath: string[]) {
            const currKey = currPath[0];
            if (currPath.length === 1) {
                // If current path has only one key, delete the property
                delete target[currKey];
            } else if (target[currKey] !== undefined && typeof target[currKey] === 'object') {
                // If current key exists and is an object, recursively call removeProperties
                removeProperties(target[currKey], currPath.slice(1));
            }
        }

        // Iterate through each path and remove corresponding properties from the result
        paths.forEach(path => {
            const pathKeys = path.split('.');
            removeProperties(result, pathKeys);
        });

        return result as Omit<T, S>;
    }


    /**
     *  Format a number with leading zeros to a fixed length
     * 
     * @param number 
     * @param maxZeros 
     * @returns 
     */
    static formatWithLeadingZeros(number, maxZeros = 10) {
        const formattedNumber = String(number).padStart(maxZeros + 1, '0');
        return formattedNumber.slice(-maxZeros);
    }

    /**
     * Remove leading zeros from a formatted number
     */
    static removeLeadingZeros(formattedNumber) {
        return String(Number(formattedNumber)); // Convert to number and back to string to remove leading zeros
    }



    static toUpperSnakeCase(str: string): string {
        return str
            .replace(/([a-z])([A-Z])/g, '$1_$2')  // Handle lowercase followed by uppercase
            .replace(/[-\s]([A-Z])/g, '_$1')      // Handle non-alphabetical followed by uppercase
            .replace('-', '_')
            .toUpperCase();
    }

    static toCamelCase(str: string): string {
        return str.toLowerCase().replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    }



    static isObject(item: any): boolean {
        return item !== null && typeof item === 'object' && !Array.isArray(item);
    }

    static deepMerge<T = any>(target: any, source: any, visited = new Map<any, any>()): T {
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) {
                        target[key] = {};
                    }
                    // Check if the source object has already been visited
                    if (!visited.has(source[key])) {
                        visited.set(source[key], {});
                        this.deepMerge(target[key], source[key], visited);
                    } else {
                        target[key] = visited.get(source[key]);
                    }
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }


    static deepClone<T>(target: T): T {
        // Check if the value is null or undefined
        if (target === null || target === undefined) {
            return target;
        }

        // Handle primitive types (string, number, boolean, etc.)
        if (typeof target !== 'object') {
            return target;
        }

        // Handle Date
        if (target instanceof Date) {
            return new Date(target.getTime()) as T;
        }

        // Handle Array
        if (Array.isArray(target)) {
            return target.map(item => this.deepClone(item)) as unknown as T;
        }

        // Handle Function
        if (typeof target === 'function') {
            return target;
        }

        // Handle Object
        if (target instanceof Object) {
            const clone = {} as T;
            for (const key in target) {
                if (target.hasOwnProperty(key)) {
                    clone[key] = this.deepClone(target[key]);
                }
            }
            return clone;
        }

        // For any other cases
        throw new Error('Unable to clone the object. Unsupported type.');
    }


    static deepCloneAndMerge<T>(target: A_TYPES__DeepPartial<T>, source: T): T {
        if (
            (source === null || source === undefined) &&
            (target === null || target === undefined))
            return target;

        // Check if the value is null or undefined
        if ((target === null || target === undefined) &&
            source
        ) {
            return this.deepClone(source);
        }

        // Handle primitive types (string, number, boolean, etc.)
        if (typeof target !== 'object') {
            return target
        }


        // Handle Date
        if (target instanceof Date) {
            return new Date(target.getTime()) as T;
        }

        // Handle Array
        if (Array.isArray(target)) {
            return target.map(item => this.deepCloneAndMerge(item, source)) as unknown as T;
        }

        // Handle Function
        if (typeof target === 'function') {
            return target;
        }

        // Handle Object
        if (target instanceof Object) {
            const clone = {} as T;
            for (const key in target) {
                if (
                    source[key] !== null
                    &&
                    source[key] !== undefined
                )
                    clone[key] = this.deepCloneAndMerge(target[key as any], source[key]);
                else
                    clone[key as any] = this.deepClone(target[key]);
            }

            for (const key in source) {
                if (
                    target[key] !== undefined
                    &&
                    target[key] !== null
                )
                    clone[key] = this.deepCloneAndMerge(target[key], source[key]);
                else
                    clone[key] = this.deepClone(source[key]);
            }
            return clone;
        }

        // For any other cases
        throw new Error('Unable to clone the object. Unsupported type.');
    }
}