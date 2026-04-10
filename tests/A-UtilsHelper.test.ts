import { A_UtilsHelper } from '@adaas/a-utils/helpers';

jest.retryTimes(0);

describe('A_UtilsHelper', () => {

    // ─────────────────────────────────────────────────────────────────────
    // serialize
    // ─────────────────────────────────────────────────────────────────────

    describe('serialize', () => {
        it('Should serialize null to "<null>"', () => {
            expect(A_UtilsHelper.serialize(null)).toBe('<null>');
        });

        it('Should serialize undefined to "<undefined>"', () => {
            expect(A_UtilsHelper.serialize(undefined)).toBe('<undefined>');
        });

        it('Should serialize strings with an "s:" prefix', () => {
            expect(A_UtilsHelper.serialize('hello')).toBe('s:hello');
            expect(A_UtilsHelper.serialize('')).toBe('s:');
        });

        it('Should serialize numbers with an "n:" prefix', () => {
            expect(A_UtilsHelper.serialize(42)).toBe('n:42');
            expect(A_UtilsHelper.serialize(0)).toBe('n:0');
            expect(A_UtilsHelper.serialize(-3.14)).toBe('n:-3.14');
        });

        it('Should serialize booleans with a "b:" prefix', () => {
            expect(A_UtilsHelper.serialize(true)).toBe('b:true');
            expect(A_UtilsHelper.serialize(false)).toBe('b:false');
        });

        it('Should serialize functions with an "fn:" prefix', () => {
            const fn = () => 42;
            expect(A_UtilsHelper.serialize(fn)).toContain('fn:');
            expect(A_UtilsHelper.serialize(fn)).toContain('42');
        });

        it('Should serialize arrays with bracket notation', () => {
            expect(A_UtilsHelper.serialize([1, 2, 3])).toBe('[n:1,n:2,n:3]');
            expect(A_UtilsHelper.serialize([])).toBe('[]');
        });

        it('Should serialize nested arrays recursively', () => {
            expect(A_UtilsHelper.serialize([[1], [2]])).toBe('[[n:1],[n:2]]');
        });

        it('Should serialize plain objects with sorted keys', () => {
            const result = A_UtilsHelper.serialize({ b: 2, a: 1 });
            // Keys must be sorted: "a" before "b"
            expect(result).toBe('{a:n:1,b:n:2}');
        });

        it('Should produce the same output regardless of key insertion order', () => {
            const r1 = A_UtilsHelper.serialize({ x: 10, y: 20 });
            const r2 = A_UtilsHelper.serialize({ y: 20, x: 10 });
            expect(r1).toBe(r2);
        });

        it('Should serialize objects with function values', () => {
            const obj = { fn: () => 1 };
            const result = A_UtilsHelper.serialize(obj);
            expect(result).toContain('fn:');
        });

        it('Should serialize Map entries with sorted key representation', () => {
            const map = new Map<string, number>([['a', 1], ['b', 2]]);
            const result = A_UtilsHelper.serialize(map);
            expect(result).toContain('Map{');
            expect(result).toContain('s:a=>n:1');
            expect(result).toContain('s:b=>n:2');
        });

        it('Should serialize Set values', () => {
            const set = new Set([1, 2, 3]);
            const result = A_UtilsHelper.serialize(set);
            expect(result).toContain('Set{');
            expect(result).toContain('n:1');
            expect(result).toContain('n:2');
            expect(result).toContain('n:3');
        });

        it('Should serialize Date instances', () => {
            const date = new Date('2024-01-01T00:00:00.000Z');
            expect(A_UtilsHelper.serialize(date)).toBe('Date:2024-01-01T00:00:00.000Z');
        });

        it('Should serialize RegExp instances', () => {
            expect(A_UtilsHelper.serialize(/abc/gi)).toBe('RegExp:/abc/gi');
        });

        it('Should use toJSON when available on an object', () => {
            const obj = {
                toJSON: () => ({ id: 42 }),
            };
            const result = A_UtilsHelper.serialize(obj);
            expect(result).toContain('json:');
            expect(result).toContain('n:42');
        });

        it('Should differentiate string "3" from number 3', () => {
            expect(A_UtilsHelper.serialize('3')).not.toBe(A_UtilsHelper.serialize(3));
        });
    });

    // ─────────────────────────────────────────────────────────────────────
    // hash
    // ─────────────────────────────────────────────────────────────────────

    describe('hash', () => {
        it('Should return a 13-character hex string', () => {
            const result = A_UtilsHelper.hash('test');
            expect(result).toMatch(/^[0-9a-f]{13}$/);
        });

        it('Should produce the same hash for identical values', () => {
            expect(A_UtilsHelper.hash('hello')).toBe(A_UtilsHelper.hash('hello'));
            expect(A_UtilsHelper.hash(42)).toBe(A_UtilsHelper.hash(42));
            expect(A_UtilsHelper.hash({ a: 1, b: 2 })).toBe(A_UtilsHelper.hash({ a: 1, b: 2 }));
        });

        it('Should produce different hashes for different values', () => {
            expect(A_UtilsHelper.hash('hello')).not.toBe(A_UtilsHelper.hash('world'));
            expect(A_UtilsHelper.hash(1)).not.toBe(A_UtilsHelper.hash(2));
        });

        it('Should produce the same hash regardless of object key order', () => {
            expect(A_UtilsHelper.hash({ x: 1, y: 2 })).toBe(A_UtilsHelper.hash({ y: 2, x: 1 }));
        });

        it('Should produce different hashes for string "3" vs number 3', () => {
            expect(A_UtilsHelper.hash('3')).not.toBe(A_UtilsHelper.hash(3));
        });

        it('Should handle null without throwing', () => {
            expect(() => A_UtilsHelper.hash(null)).not.toThrow();
            expect(A_UtilsHelper.hash(null)).toMatch(/^[0-9a-f]{13}$/);
        });

        it('Should handle undefined without throwing', () => {
            expect(() => A_UtilsHelper.hash(undefined)).not.toThrow();
            expect(A_UtilsHelper.hash(undefined)).toMatch(/^[0-9a-f]{13}$/);
        });

        it('Should produce different hashes for null and undefined', () => {
            expect(A_UtilsHelper.hash(null)).not.toBe(A_UtilsHelper.hash(undefined));
        });

        it('Should produce deterministic hashes for arrays', () => {
            expect(A_UtilsHelper.hash([1, 2, 3])).toBe(A_UtilsHelper.hash([1, 2, 3]));
            expect(A_UtilsHelper.hash([1, 2, 3])).not.toBe(A_UtilsHelper.hash([3, 2, 1]));
        });

        it('Should produce deterministic hashes for nested objects', () => {
            const obj1 = { user: { name: 'Alice', age: 30 } };
            const obj2 = { user: { age: 30, name: 'Alice' } };
            expect(A_UtilsHelper.hash(obj1)).toBe(A_UtilsHelper.hash(obj2));
        });
    });

    // ─────────────────────────────────────────────────────────────────────
    // getByPath
    // ─────────────────────────────────────────────────────────────────────

    describe('getByPath', () => {
        it('Should return a top-level property', () => {
            const obj = { name: 'Alice' };
            expect(A_UtilsHelper.getByPath(obj, 'name')).toBe('Alice');
        });

        it('Should return a nested property via dot notation', () => {
            const obj = { user: { profile: { city: 'Paris' } } };
            expect(A_UtilsHelper.getByPath(obj, 'user.profile.city')).toBe('Paris');
        });

        it('Should return undefined for a missing path', () => {
            const obj = { user: { name: 'Alice' } };
            expect(A_UtilsHelper.getByPath(obj, 'user.age')).toBeUndefined();
        });

        it('Should return undefined when an intermediate key is missing', () => {
            const obj = { a: { b: 1 } };
            expect(A_UtilsHelper.getByPath(obj, 'a.c.d')).toBeUndefined();
        });

        it('Should return the whole object when path is empty string', () => {
            const obj = { x: 1 };
            expect(A_UtilsHelper.getByPath(obj, '')).toStrictEqual(obj);
        });

        it('Should return undefined when obj is null', () => {
            expect(A_UtilsHelper.getByPath(null, 'a.b')).toBeUndefined();
        });

        it('Should return undefined when obj is a primitive', () => {
            expect(A_UtilsHelper.getByPath('string', 'length')).toBeUndefined();
        });

        it('Should not throw when navigating through null/undefined intermediate values', () => {
            const obj = { a: null };
            expect(() => A_UtilsHelper.getByPath(obj, 'a.b.c')).not.toThrow();
            expect(A_UtilsHelper.getByPath(obj, 'a.b.c')).toBeUndefined();
        });
    });

    // ─────────────────────────────────────────────────────────────────────
    // setBypath
    // ─────────────────────────────────────────────────────────────────────

    describe('setBypath', () => {
        it('Should set a top-level property on an existing object', () => {
            const obj = { name: 'Alice' };
            A_UtilsHelper.setBypath(obj, 'name', 'Bob');
            expect(obj.name).toBe('Bob');
        });

        it('Should set a nested property via dot notation', () => {
            const obj: any = { user: { name: 'Alice' } };
            A_UtilsHelper.setBypath(obj, 'user.name', 'Bob');
            expect(obj.user.name).toBe('Bob');
        });

        it('Should create intermediate objects for a deep path that does not exist', () => {
            const obj: any = {};
            A_UtilsHelper.setBypath(obj, 'a.b.c', 42);
            expect(obj.a.b.c).toBe(42);
        });

        it('Should return the mutated object', () => {
            const obj = { x: 1 };
            const result = A_UtilsHelper.setBypath(obj, 'x', 99);
            expect(result).toBe(obj);
            expect(result!.x).toBe(99);
        });

        it('Should return undefined when obj is null', () => {
            expect(A_UtilsHelper.setBypath(null, 'a', 1)).toBeUndefined();
        });

        it('Should return undefined when obj is a non-object primitive', () => {
            expect(A_UtilsHelper.setBypath('string', 'a', 1)).toBeUndefined();
        });

        it('Should return undefined when path is an empty string', () => {
            expect(A_UtilsHelper.setBypath({}, '', 1)).toBeUndefined();
        });

        it('Should return undefined when path is not a string', () => {
            // @ts-ignore - Testing runtime safety
            expect(A_UtilsHelper.setBypath({}, 123, 1)).toBeUndefined();
        });

        it('Should overwrite an existing nested value', () => {
            const obj: any = { config: { timeout: 1000 } };
            A_UtilsHelper.setBypath(obj, 'config.timeout', 5000);
            expect(obj.config.timeout).toBe(5000);
        });

        it('Should be consistent with getByPath after a set operation', () => {
            const obj: any = {};
            A_UtilsHelper.setBypath(obj, 'user.profile.name', 'Alice');
            expect(A_UtilsHelper.getByPath(obj, 'user.profile.name')).toBe('Alice');
        });
    });
});
