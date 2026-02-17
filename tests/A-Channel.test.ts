import { A_Channel, A_ChannelError, A_ChannelFeatures, A_ChannelRequest } from '@adaas/a-utils/a-channel';
import './jest.setup';
import { A_Context, A_Component, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_OperationContext } from '@adaas/a-utils/a-operation';


jest.retryTimes(0);

describe('A-Channel tests', () => {

    beforeEach(() => {
        A_Context.reset();
    });

    describe('Basic Channel Creation and Properties', () => {
        it('Should allow to create a channel', async () => {
            const channel = new A_Channel();
            A_Context.root.register(channel);

            expect(channel).toBeInstanceOf(A_Channel);
            expect(channel).toBeInstanceOf(A_Component);
            expect(channel.processing).toBe(false);
        });

        it('Should have correct initial state', async () => {
            const channel = new A_Channel();
            A_Context.root.register(channel);

            expect(channel.processing).toBe(false);
            expect(channel.initialize).toBeInstanceOf(Promise);
        });

        it('Should initialize only once', async () => {
            const channel = new A_Channel();
            A_Context.root.register(channel);

            const init1 = channel.initialize;
            const init2 = channel.initialize;

            expect(init1).toBe(init2); // Same promise instance
            await init1;
            await init2;
        });
    });

    describe('Channel Connection Lifecycle', () => {
        it('Should handle connection lifecycle', async () => {
            const channel = new A_Channel();
            A_Context.root.register(channel);

            // Should connect successfully
            await channel.connect();
            expect(channel.initialize).toBeInstanceOf(Promise);
            await channel.initialize;

            // Should disconnect successfully
            await channel.disconnect();
        });

        it('Should support custom connection logic', async () => {
            const connectCalls: string[] = [];
            const disconnectCalls: string[] = [];

            class CustomChannel extends A_Channel {}

            class ChannelConnector extends A_Component {
                @A_Feature.Extend({ scope: [CustomChannel] })
                async [A_ChannelFeatures.onConnect]() {
                    connectCalls.push('connected');
                }

                @A_Feature.Extend({ scope: [CustomChannel] })
                async [A_ChannelFeatures.onDisconnect]() {
                    disconnectCalls.push('disconnected');
                }
            }

            A_Context.root.register(ChannelConnector);

            const channel = new CustomChannel();
            A_Context.root.register(channel);

            await channel.connect();
            expect(connectCalls).toEqual(['connected']);

            await channel.disconnect();
            expect(disconnectCalls).toEqual(['disconnected']);
        });
    });

    describe('Request Processing', () => {
        it('Should handle basic request', async () => {
            const channel = new A_Channel();
            A_Context.root.register(channel);

            const params = { action: 'test', data: 'hello' };
            const context = await channel.request(params);

            expect(context).toBeInstanceOf(A_ChannelRequest);
            expect(context.params).toEqual(params);
            expect(channel.processing).toBe(false); // Should reset after processing
        });

        it('Should handle request with custom logic', async () => {
            const processingOrder: string[] = [];

            class TestChannel extends A_Channel {}

            class RequestProcessor extends A_Component {
                @A_Feature.Extend({ scope: [TestChannel] })
                async [A_ChannelFeatures.onBeforeRequest](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    processingOrder.push('before');
                    expect(context.params.action).toBe('test');
                }

                @A_Feature.Extend({ scope: [TestChannel] })
                async [A_ChannelFeatures.onRequest](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    processingOrder.push('during');
                    // Simulate processing and setting result
                    context.succeed({ processed: true, original: context.params });
                }

                @A_Feature.Extend({ scope: [TestChannel] })
                async [A_ChannelFeatures.onAfterRequest](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    processingOrder.push('after');
                    expect(context.data).toBeDefined();
                }
            }

            A_Context.root.register(RequestProcessor);

            const channel = new TestChannel();
            A_Context.root.register(channel);

            const params = { action: 'test', data: 'hello' };
            const context = await channel.request(params);

            expect(processingOrder).toEqual(['before', 'during', 'after']);
            expect(context.data).toEqual({ processed: true, original: params });
        });

        it('Should handle request errors gracefully', async () => {
            const errorCalls: string[] = [];

            class ErrorChannel extends A_Channel {}

            class ErrorProcessor extends A_Component {
                @A_Feature.Extend({ scope: [ErrorChannel] })
                async [A_ChannelFeatures.onRequest]() {
                    throw new Error('Request processing failed');
                }

                @A_Feature.Extend({ scope: [ErrorChannel] })
                async [A_ChannelFeatures.onError](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    errorCalls.push('error-handled');
                    expect(context.error).toBeDefined();
                }
            }

            A_Context.root.register(ErrorProcessor);

            const channel = new ErrorChannel();
            A_Context.root.register(channel);

            const params = { action: 'fail' };
            
            // Request should throw an error since the processing fails
            await expect(channel.request(params)).rejects.toThrow();

            expect(errorCalls).toEqual(['error-handled']);
            expect(channel.processing).toBe(false); // Should reset even on error
        });

        it('Should support typed requests', async () => {
            interface TestParams {
                userId: string;
                action: 'create' | 'update' | 'delete';
            }

            interface TestResult {
                success: boolean;
                userId: string;
                timestamp: string;
            }

            class TypedChannel extends A_Channel {}

            class TypedProcessor extends A_Component {
                @A_Feature.Extend({ scope: [TypedChannel] })
                async [A_ChannelFeatures.onRequest](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest<TestParams, TestResult>
                ) {
                    const { userId, action } = context.params;
                    context.succeed({
                        success: true,
                        userId,
                        timestamp: new Date().toISOString()
                    });
                }
            }

            A_Context.root.register(TypedProcessor);

            const channel = new TypedChannel();
            A_Context.root.register(channel);

            const params: TestParams = { userId: '123', action: 'create' };
            const context = await channel.request<TestParams, TestResult>(params);

            expect(context.params.userId).toBe('123');
            expect(context.params.action).toBe('create');
            expect(context.data?.success).toBe(true);
            expect(context.data?.userId).toBe('123');
            expect(context.data?.timestamp).toBeDefined();
        });
    });

    describe('Send (Fire-and-Forget) Operations', () => {
        it('Should handle basic send operation', async () => {
            const channel = new A_Channel();
            A_Context.root.register(channel);

            const message = { type: 'notification', content: 'Hello World' };

            // Should not throw
            await expect(channel.send(message)).resolves.not.toThrow();
            expect(channel.processing).toBe(false);
        });

        it('Should handle send with custom logic', async () => {
            const sentMessages: any[] = [];

            class SendChannel extends A_Channel {}

            class SendProcessor extends A_Component {
                @A_Feature.Extend({ scope: [SendChannel] })
                async [A_ChannelFeatures.onSend](
                    @A_Inject(A_OperationContext) context: A_OperationContext
                ) {
                    sentMessages.push(context.params);
                }
            }

            A_Context.root.register(SendProcessor);

            const channel = new SendChannel();
            A_Context.root.register(channel);

            const message1 = { type: 'email', to: 'user@example.com' };
            const message2 = { type: 'sms', to: '+1234567890' };

            await channel.send(message1);
            await channel.send(message2);

            expect(sentMessages).toHaveLength(2);
            expect(sentMessages[0]).toEqual(message1);
            expect(sentMessages[1]).toEqual(message2);
        });

        it('Should handle send errors gracefully', async () => {
            const errorCalls: string[] = [];

            class ErrorSendChannel extends A_Channel {}

            class ErrorSendProcessor extends A_Component {
                @A_Feature.Extend({ scope: [ErrorSendChannel] })
                async [A_ChannelFeatures.onSend]() {
                    throw new Error('Send operation failed');
                }

                @A_Feature.Extend({ scope: [ErrorSendChannel] })
                async [A_ChannelFeatures.onError](
                    @A_Inject(A_OperationContext) context: A_OperationContext
                ) {
                    errorCalls.push('send-error-handled');
                    expect(context.error).toBeDefined();
                }
            }

            A_Context.root.register(ErrorSendProcessor);

            const channel = new ErrorSendChannel();
            A_Context.root.register(channel);

            const message = { type: 'failing-message' };

            // Should not throw, errors are handled internally
            await expect(channel.send(message)).resolves.not.toThrow();
            expect(errorCalls).toEqual(['send-error-handled']);
            expect(channel.processing).toBe(false);
        });
    });

    describe('Error Handling', () => {
        it('Should create proper channel errors', async () => {
            const originalError = new Error('Original error message');
            const channelError = new A_ChannelError(originalError);

            expect(channelError).toBeInstanceOf(A_ChannelError);
            expect(channelError.message).toContain('Original error message');
        });

        it('Should handle multiple error types', async () => {
            const errorTypes: string[] = [];

            class MultiErrorChannel extends A_Channel {}

            class MultiErrorProcessor extends A_Component {
                @A_Feature.Extend({ scope: [MultiErrorChannel] })
                async [A_ChannelFeatures.onRequest](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    const errorType = context.params.errorType;
                    switch (errorType) {
                        case 'network':
                            throw new Error('Network error');
                        case 'validation':
                            throw new Error('Validation error');
                        case 'timeout':
                            throw new Error('Timeout error');
                        default:
                            // No error
                    }
                }

                @A_Feature.Extend({ scope: [MultiErrorChannel] })
                async [A_ChannelFeatures.onError](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    errorTypes.push(context.params.errorType);
                }
            }

            A_Context.root.register(MultiErrorProcessor);

            const channel = new MultiErrorChannel();
            A_Context.root.register(channel);

            // These requests should all throw errors, but the error handler should be called
            try { await channel.request({ errorType: 'network' }); } catch (e) { /* expected */ }
            try { await channel.request({ errorType: 'validation' }); } catch (e) { /* expected */ }
            try { await channel.request({ errorType: 'timeout' }); } catch (e) { /* expected */ }
            await channel.request({ errorType: 'none' }); // Should not error

            expect(errorTypes).toEqual(['network', 'validation', 'timeout']);
        });
    });

    describe('Channel Integration and Extension', () => {
        it('Should support multiple channel instances', async () => {
            const channel1 = new A_Channel();
            const channel2 = new A_Channel();

            A_Context.root.register(channel1);
            A_Context.root.register(channel2);

            // Both should work independently
            const result1 = await channel1.request({ id: 1 });
            const result2 = await channel2.request({ id: 2 });

            expect(result1.params.id).toBe(1);
            expect(result2.params.id).toBe(2);
        });

        it('Should support channel inheritance', async () => {
            class HttpChannel extends A_Channel {
                async makeHttpRequest(url: string, method: string = 'GET') {
                    return this.request({ url, method, timestamp: Date.now() });
                }
            }

            class WebSocketChannel extends A_Channel {
                async sendMessage(message: string) {
                    return this.send({ message, type: 'websocket', timestamp: Date.now() });
                }
            }

            const httpChannel = new HttpChannel();
            const wsChannel = new WebSocketChannel();

            A_Context.root.register(httpChannel);
            A_Context.root.register(wsChannel);

            const httpResult = await httpChannel.makeHttpRequest('https://api.example.com');
            expect(httpResult.params.url).toBe('https://api.example.com');
            expect(httpResult.params.method).toBe('GET');

            await expect(wsChannel.sendMessage('Hello WebSocket')).resolves.not.toThrow();
        });

        it('Should support feature extension with different channel types', async () => {
            const httpCalls: string[] = [];
            const wsCalls: string[] = [];

            class HttpChannel extends A_Channel {}
            class WebSocketChannel extends A_Channel {}

            class HttpProcessor extends A_Component {
                @A_Feature.Extend({ scope: [HttpChannel] })
                async [A_ChannelFeatures.onRequest](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    httpCalls.push(`HTTP: ${context.params.method} ${context.params.url}`);
                }
            }

            class WebSocketProcessor extends A_Component {
                @A_Feature.Extend({ scope: [WebSocketChannel] })
                async [A_ChannelFeatures.onSend](
                    @A_Inject(A_OperationContext) context: A_OperationContext
                ) {
                    wsCalls.push(`WS: ${context.params.message}`);
                }
            }

            A_Context.root.register(HttpProcessor);
            A_Context.root.register(WebSocketProcessor);

            const httpChannel = new HttpChannel();
            const wsChannel = new WebSocketChannel();

            A_Context.root.register(httpChannel);
            A_Context.root.register(wsChannel);

            await httpChannel.request({ method: 'POST', url: '/api/users' });
            await wsChannel.send({ message: 'Hello World' });

            expect(httpCalls).toEqual(['HTTP: POST /api/users']);
            expect(wsCalls).toEqual(['WS: Hello World']);
        });
    });

    describe('Performance and Concurrency', () => {
        it('Should handle concurrent requests', async () => {
            const processingOrder: number[] = [];

            class ConcurrentChannel extends A_Channel {}

            class ConcurrentProcessor extends A_Component {
                @A_Feature.Extend({ scope: [ConcurrentChannel] })
                async [A_ChannelFeatures.onRequest](
                    @A_Inject(A_ChannelRequest) context: A_ChannelRequest
                ) {
                    const delay = context.params.delay || 0;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    processingOrder.push(context.params.id);
                    context.succeed({ processed: context.params.id });
                }
            }

            A_Context.root.register(ConcurrentProcessor);

            const channel = new ConcurrentChannel();
            A_Context.root.register(channel);

            // Start multiple requests concurrently
            const requests = [
                channel.request({ id: 1, delay: 100 }),
                channel.request({ id: 2, delay: 50 }),
                channel.request({ id: 3, delay: 25 })
            ];

            const results = await Promise.all(requests);

            // Results should be in completion order (3, 2, 1 due to delays)
            expect(processingOrder).toEqual([3, 2, 1]);
            expect(results[0].data?.processed).toBe(1);
            expect(results[1].data?.processed).toBe(2);
            expect(results[2].data?.processed).toBe(3);
        });

        it('Should handle processing state correctly during concurrent operations', async () => {
            const channel = new A_Channel();
            A_Context.root.register(channel);

            const request1Promise = channel.request({ id: 1 });
            const request2Promise = channel.request({ id: 2 });

            // Both requests should complete
            const [result1, result2] = await Promise.all([request1Promise, request2Promise]);

            expect(result1.params.id).toBe(1);
            expect(result2.params.id).toBe(2);
            expect(channel.processing).toBe(false); // Should be false after all complete
        });
    });
});