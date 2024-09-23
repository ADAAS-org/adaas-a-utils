import { A_CommonHelper } from '@adaas/a-utils/helpers/A_Common.helper';
import { A_ScheduleHelper } from '@adaas/a-utils/helpers/A_Schedule.helper';
import { A_TYPES__DeepPartial } from '@adaas/a-utils/types/A_Common.types';
import { config } from 'dotenv';
config();
jest.retryTimes(0);

describe('CommonHelper Tests', () => {

    it('Schedule Should execute promise and await it ', async () => {

        const start = Date.now();
        let res = '';

        try {
            const scheduler = A_ScheduleHelper.schedule(3000, async () => {
                return 'RESOLVED';
            });


            res = await scheduler.promise;

        } catch (error) {
            // Handle error if any
        } finally {
            const end = Date.now();
            const duration = end - start;

            expect(res).toBe('RESOLVED');
            // Check if the duration exceeds 3 seconds
            expect(duration).toBeGreaterThan(3000);
        }

    });

    it('Schedule Should be canceled and rejected', async () => {

        const start = Date.now();
        let res = '';

        try {
            const scheduler = A_ScheduleHelper.schedule(3000, async () => {
                return 'RESOLVED';
            });


            scheduler.clear();
            res = await scheduler.promise;
        } catch (error) {
            // Handle error if any
        } finally {
            const end = Date.now();
            const duration = end - start;

            expect(res).toBe('');
            // Check if the duration exceeds 3 seconds
            expect(duration).toBeLessThan(3000);
        }

    });

    it('Deep Clone and  Merge ', async () => {

        type TestType = {
            a: string,
            b: string,
            c: {
                d: string
            },
            f: (name: string) => string
            s: Date
        }

        const t: TestType = {
            a: 'a',
            b: 'b',
            c: {
                d: 'd'
            },
            f: (name: string) => { return name },
            s: new Date()
        }

        const t2: A_TYPES__DeepPartial<TestType> = {
            a: 'aa',
            c: {
                d: 'dd'
            },
            f: (name: string) => { return name + '2' }
        }

        const merged = A_CommonHelper.deepCloneAndMerge(t2, t);


        const name = merged.f('names');


        expect(merged.a).toBe('aa');
        expect(merged.b).toBe('b');
        expect(merged.c.d).toBe('dd');
        expect(name).toBe('names2');
        expect(t).not.toEqual(merged);
        expect(t2).not.toEqual(merged);
    });

    it('Deep Clone Different Types', async () => {

        type TestType = {
            a: string,
            b: string,
            c: {
                d: string
            },
            bool:{
                a: boolean
            },
            f: (name: string) => string
            s: Date
        }

        const t: TestType = {
            a: 'a',
            b: 'b',
            c: {
                d: 'd'
            },
            bool:{
                a: true
            },
            f: (name: string) => { return name },
            s: new Date()
        }

        const t2: any = {
            e: 'foo',
            b: 'bb',
            c:{
                d: 'ddd'
            },
            bool:{
                a: false
            },
            some: {
                d: 'dd'
            },
        }

        const merged = A_CommonHelper.deepCloneAndMerge(t2, t);

        console.log('merged: ', merged)

        expect(merged.a).toBe('a');
        expect(merged.b).toBe('bb');
        expect(merged.c.d).toBe('ddd');
        expect(merged.bool.a).toBe(false);
        expect((merged as any).e).toBe('foo');
        expect((merged as any).some.d).toBe('dd');
        expect(merged.f('names')).toBe('names');
    });
});