import { A_Scope } from "@adaas/a-concept";
import { A_Config, ENVConfigReader } from "@adaas/a-utils/a-config";
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_Polyfill } from "@adaas/a-utils/a-polyfill";

jest.retryTimes(0);

describe('A-StateMachine tests', () => {

    it('Should allow to create a state machine', async () => {


        class foo extends A_Logger {
            log(message: any, ...args: any[]): void {
                console.log('foo log:', message, ...args);
            }
            error(message: any, ...args: any[]): void {
                console.error('foo error:', message, ...args);
            }
        }

        const testScope = new A_Scope({
            components: [foo, A_Polyfill, ENVConfigReader]
        });

        const logger = testScope.resolve(A_Logger);

        logger?.log('State machine created successfully');
    });
})