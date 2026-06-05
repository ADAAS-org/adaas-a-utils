import { A_Concept, A_Container, A_Error, A_Inject } from "@adaas/a-concept"
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_Polyfill } from "@adaas/a-utils/a-polyfill";



(async () => {
    class TestContainer extends A_Container {
        @A_Concept.Load()
        throwsLoad(
            @A_Inject(A_Logger) logger: A_Logger,
        ) {
            logger.info('TestContainer', 'About to throw an error from the load phase...');

            logger.info("Some Object", { a: 1, b: { c: 2, d: [3, 4, 5] } }, 'and array', [1, 2, 3, 4, 5]);

            logger.warning('This is a warning message from the load phase of TestContainer.');

            logger.info('cyan', 'This is an info message with cyan color from the load phase of TestContainer.', new Error('Sample error for logging'));
            logger.info('red', 'This is an info message with cyan color from the load phase of TestContainer.');

            throw new Error('This is a test error thrown from the load phase of TestContainer.');
        }

        @A_Concept.Start()
        throwsStart() {
            throw new A_Error({
                title: 'Test Error',
                message: 'This is a test error thrown from TestContainer.',
                originalError: new Error('Original error message'),
            })
        }
    }

    const concept = new A_Concept({
        name: 'Error Logger Example',
        components: [A_Logger, A_Polyfill],
        containers: [new TestContainer()],
    });

    const logger: A_Logger = concept.resolve(A_Logger)!;

    try {
        await concept.load();

    } catch (error) {
        logger!.error('An error occurred:', error);
    }

    try {
        await concept.start();
    } catch (error) {
        logger!.error('An error occurred:', error);
    }


})()