import './jest.setup';
import { A_Scope } from "@adaas/a-concept";
import { A_Schedule } from "@adaas/a-utils/lib/A-Schedule/A-Schedule.component";

jest.retryTimes(0);

describe('A-Schedule Tests', () => {
    it('Schedule allow to create schedule component', async () => {
        const testScope = new A_Scope({
            components: [A_Schedule]
        });

        const schedule = testScope.resolve(A_Schedule);

        expect(schedule).toBeInstanceOf(A_Schedule);
    });

    it('Schedule Should execute promise and await it ', async () => {

        const testScope = new A_Scope({
            components: [A_Schedule]
        });

        const schedule = testScope.resolve(A_Schedule)!;

        const start = Date.now();
        let res = '';

        try {
            const scheduler = await schedule.delay(3000, async () => {
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

        const testScope = new A_Scope({
            components: [A_Schedule]
        });

        const schedule = testScope.resolve(A_Schedule)!;

        expect(schedule).toBeInstanceOf(A_Schedule);


        const start = Date.now();
        let res = '';

        try {
            const scheduler = await schedule.delay(3000, async () => {
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
});