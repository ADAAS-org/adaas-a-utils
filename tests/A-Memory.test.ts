import { A_Memory } from '@adaas/a-utils/lib/A-Memory/A-Memory.component';
import { A_MemoryContext } from '@adaas/a-utils/lib/A-Memory/A-Memory.context';
import { A_MemoryError } from '@adaas/a-utils/lib/A-Memory/A-Memory.error';
import { A_Component, A_Concept, A_Container, A_Context, A_Error } from '@adaas/a-concept';

jest.retryTimes(0);

describe('A-Memory tests', () => {

    beforeEach(() => {
        A_Context.reset();
    });

    it('Should allow to create memory instance', async () => {
        const memory = new A_Memory();
        A_Context.root.register(memory);

        expect(memory).toBeInstanceOf(A_Memory);
        expect(memory).toBeInstanceOf(A_Component);
        
        // Test that memory can be initialized
        await memory.ready;
    });

    it('Should allow to initialize and set initial values', async () => {
        const memory = new A_Memory<{
            key1: string;
            key2: number;
            key3: { nested: string };
        }>();
        A_Context.root.register(memory);

        await memory.ready;

        // Set initial values after initialization
        await memory.set('key1', 'value1');
        await memory.set('key2', 42);
        await memory.set('key3', { nested: 'object' });

        expect(await memory.get('key1')).toBe('value1');
        expect(await memory.get('key2')).toBe(42);
        expect(await memory.get('key3')).toEqual({ nested: 'object' });
    });

    it('Should allow to set and get values', async () => {
        const memory = new A_Memory<{
            stringValue: string;
            numberValue: number;
            objectValue: { prop: string };
        }>();
        A_Context.root.register(memory);

        await memory.ready;

        await memory.set('stringValue', 'test string');
        await memory.set('numberValue', 123);
        await memory.set('objectValue', { prop: 'test' });

        expect(await memory.get('stringValue')).toBe('test string');
        expect(await memory.get('numberValue')).toBe(123);
        expect(await memory.get('objectValue')).toEqual({ prop: 'test' });
    });

    it('Should return undefined for non-existent keys', async () => {
        const memory = new A_Memory<{ existingKey: string }>();
        A_Context.root.register(memory);

        await memory.ready;

        expect(await memory.get('existingKey')).toBeUndefined();
        expect(await memory.get('nonExistentKey' as any)).toBeUndefined();
    });

    it('Should allow to drop values', async () => {
        const memory = new A_Memory<{ key1: string; key2: number }>();
        A_Context.root.register(memory);

        await memory.ready;

        await memory.set('key1', 'value1');
        await memory.set('key2', 42);

        expect(await memory.get('key1')).toBe('value1');
        expect(await memory.get('key2')).toBe(42);

        await memory.drop('key1');

        expect(await memory.get('key1')).toBeUndefined();
        expect(await memory.get('key2')).toBe(42);
    });

    it('Should allow to clear all values', async () => {
        const memory = new A_Memory<{ key1: string; key2: number }>();
        A_Context.root.register(memory);

        await memory.ready;

        await memory.set('key1', 'value1');
        await memory.set('key2', 42);

        expect(await memory.get('key1')).toBe('value1');
        expect(await memory.get('key2')).toBe(42);

        await memory.clear();

        expect(await memory.get('key1')).toBeUndefined();
        expect(await memory.get('key2')).toBeUndefined();
    });

    it('Should check if keys exist with has method', async () => {
        const memory = new A_Memory<{ key1: string; key2: number }>();
        A_Context.root.register(memory);

        await memory.ready;

        // Initially, keys should not exist
        expect(await memory.has('key1')).toBe(false);
        expect(await memory.has('key2')).toBe(false);

        // Set values
        await memory.set('key1', 'value1');
        await memory.set('key2', 42);

        // Now keys should exist
        expect(await memory.has('key1')).toBe(true);
        expect(await memory.has('key2')).toBe(true);

        // Drop one key
        await memory.drop('key1');

        // Should only have key2 now
        expect(await memory.has('key1')).toBe(false);
        expect(await memory.has('key2')).toBe(true);
    });

    it('Should destroy and reinitialize correctly', async () => {
        const memory = new A_Memory<{ key1: string; key2: number }>();
        A_Context.root.register(memory);

        await memory.ready;

        // Set some values
        await memory.set('key1', 'value1');
        await memory.set('key2', 42);

        expect(await memory.get('key1')).toBe('value1');
        expect(await memory.get('key2')).toBe(42);

        // Destroy memory
        await memory.destroy();

        // Memory should be ready to reinitialize
        await memory.ready;

        // After reinitializing, values should be cleared
        expect(await memory.get('key1')).toBeUndefined();
        expect(await memory.get('key2')).toBeUndefined();
    });

    it('Should return undefined for toJSON when no serialization feature is implemented', async () => {
        const memory = new A_Memory();
        await A_Context.root.register(memory);
        await memory.ready;
        
        // Set some values
        await memory.set('stringProp', 'test');
        await memory.set('numberProp', 42);
        await memory.set('objectProp', { nested: 'value' });
        await memory.set('arrayProp', [1, 2, 3]);

        const json = await memory.toJSON();

        // Since no onSerialize feature is implemented, toJSON returns undefined
        expect(json).toBeUndefined();
    });

    it('Should return undefined for toJSON when no serialization feature is implemented (with complex objects)', async () => {
        class SerializableObject {
            constructor(private value: string) { }

            toJSON() {
                return { serialized: this.value };
            }
        }

        const memory = new A_Memory<{
            regular: string;
            serializable: SerializableObject;
        }>();
        A_Context.root.register(memory);

        await memory.ready;

        await memory.set('regular', 'normal value');
        await memory.set('serializable', new SerializableObject('test'));

        const json = await memory.toJSON();

        // Since no onSerialize feature is implemented, toJSON returns undefined
        expect(json).toBeUndefined();
    });

    it('Should handle null and undefined values correctly', async () => {
        const memory = new A_Memory<{
            nullValue: null;
            undefinedValue: undefined;
            stringValue: string;
        }>();
        A_Context.root.register(memory);

        await memory.ready;

        await memory.set('nullValue', null);
        await memory.set('undefinedValue', undefined);
        await memory.set('stringValue', 'test');

        expect(await memory.get('nullValue')).toBe(null);
        expect(await memory.get('undefinedValue')).toBe(undefined);
        expect(await memory.get('stringValue')).toBe('test');

        const json = await memory.toJSON();
        // Since no onSerialize feature is implemented, toJSON returns undefined
        expect(json).toBeUndefined();
    });
});