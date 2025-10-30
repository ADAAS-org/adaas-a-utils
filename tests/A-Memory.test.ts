import { A_Memory } from '@adaas/a-utils/lib/A-Memory/A-Memory.context';
import { A_Error } from '@adaas/a-concept';

jest.retryTimes(0);

describe('A-Memory tests', () => {

    it('Should allow to create memory instance', () => {
        const memory = new A_Memory();
        
        expect(memory).toBeInstanceOf(A_Memory);
        expect(memory.Errors).toBeUndefined();
    });

    it('Should allow to create memory with initial values', () => {
        const initialValues = {
            key1: 'value1',
            key2: 42,
            key3: { nested: 'object' }
        };
        
        const memory = new A_Memory(initialValues);
        
        expect(memory.get('key1')).toBe('value1');
        expect(memory.get('key2')).toBe(42);
        expect(memory.get('key3')).toEqual({ nested: 'object' });
    });

    it('Should allow to set and get values', async () => {
        const memory = new A_Memory<{ 
            stringValue: string;
            numberValue: number;
            objectValue: { prop: string };
        }>();
        
        await memory.set('stringValue', 'test string');
        await memory.set('numberValue', 123);
        await memory.set('objectValue', { prop: 'test' });
        
        expect(memory.get('stringValue')).toBe('test string');
        expect(memory.get('numberValue')).toBe(123);
        expect(memory.get('objectValue')).toEqual({ prop: 'test' });
    });

    it('Should return undefined for non-existent keys', () => {
        const memory = new A_Memory<{ existingKey: string }>();
        
        expect(memory.get('existingKey')).toBeUndefined();
        expect(memory.get('nonExistentKey' as any)).toBeUndefined();
    });

    it('Should allow to drop values', async () => {
        const memory = new A_Memory<{ key1: string; key2: number }>();
        
        await memory.set('key1', 'value1');
        await memory.set('key2', 42);
        
        expect(memory.get('key1')).toBe('value1');
        expect(memory.get('key2')).toBe(42);
        
        await memory.drop('key1');
        
        expect(memory.get('key1')).toBeUndefined();
        expect(memory.get('key2')).toBe(42);
    });

    it('Should allow to clear all values', async () => {
        const memory = new A_Memory<{ key1: string; key2: number }>();
        
        await memory.set('key1', 'value1');
        await memory.set('key2', 42);
        
        expect(memory.get('key1')).toBe('value1');
        expect(memory.get('key2')).toBe(42);
        
        await memory.clear();
        
        expect(memory.get('key1')).toBeUndefined();
        expect(memory.get('key2')).toBeUndefined();
    });

    it('Should handle errors correctly', async () => {
        const memory = new A_Memory();
        
        expect(memory.Errors).toBeUndefined();
        
        const error1 = new A_Error({ title: 'Error 1' });
        const error2 = new A_Error({ title: 'Error 2' });
        
        await memory.error(error1);
        await memory.error(error2);
        
        expect(memory.Errors).toBeDefined();
        expect(memory.Errors?.size).toBe(2);
        expect(memory.Errors?.has(error1)).toBe(true);
        expect(memory.Errors?.has(error2)).toBe(true);
    });

    it('Should verify prerequisites correctly', async () => {
        const memory = new A_Memory<{ 
            required1: string;
            required2: number;
            optional?: string;
        }>();
        
        // No values set initially
        expect(await memory.prerequisites(['required1', 'required2'])).toBe(false);
        
        // Set one required value
        await memory.set('required1', 'value1');
        expect(await memory.prerequisites(['required1', 'required2'])).toBe(false);
        
        // Set both required values
        await memory.set('required2', 42);
        expect(await memory.prerequisites(['required1', 'required2'])).toBe(true);

        // Test with empty requirements
        expect(await memory.prerequisites([])).toBe(true);
    });

    it('Should serialize to JSON correctly', async () => {
        const memory = new A_Memory<{
            stringProp: string;
            numberProp: number;
            objectProp: { nested: string };
            arrayProp: number[];
        }>();
        
        await memory.set('stringProp', 'test');
        await memory.set('numberProp', 42);
        await memory.set('objectProp', { nested: 'value' });
        await memory.set('arrayProp', [1, 2, 3]);
        
        const json = memory.toJSON();
        
        expect(json).toEqual({
            stringProp: 'test',
            numberProp: 42,
            objectProp: { nested: 'value' },
            arrayProp: [1, 2, 3]
        });
    });

    it('Should handle objects with toJSON method in serialization', async () => {
        class SerializableObject {
            constructor(private value: string) {}
            
            toJSON() {
                return { serialized: this.value };
            }
        }
        
        const memory = new A_Memory<{
            regular: string;
            serializable: SerializableObject;
        }>();
        
        await memory.set('regular', 'normal value');
        await memory.set('serializable', new SerializableObject('test'));
        
        const json = memory.toJSON();
        
        expect(json).toEqual({
            regular: 'normal value',
            serializable: { serialized: 'test' }
        });
    });

    it('Should handle null and undefined values correctly', async () => {
        const memory = new A_Memory<{
            nullValue: null;
            undefinedValue: undefined;
            stringValue: string;
        }>();
        
        await memory.set('nullValue', null);
        await memory.set('undefinedValue', undefined);
        await memory.set('stringValue', 'test');
        
        expect(memory.get('nullValue')).toBe(null);
        expect(memory.get('undefinedValue')).toBe(undefined);
        expect(memory.get('stringValue')).toBe('test');
        
        const json = memory.toJSON();
        expect(json.nullValue).toBe(null);
        expect(json.undefinedValue).toBe(undefined);
        expect(json.stringValue).toBe('test');
    });
});