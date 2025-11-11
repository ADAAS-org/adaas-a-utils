/**
 * A-Channel Examples
 * 
 * This file contains practical examples of using A-Channel for various communication scenarios.
 * Run with: npx ts-node examples/channel-examples.ts
 */

import { A_Channel } from '../src/lib/A-Channel/A-Channel.component';
import { A_ChannelFeatures } from '../src/lib/A-Channel/A-Channel.constants';
import { A_ChannelRequest } from '../src/lib/A-Channel/A-ChannelRequest.context';
import { A_Component, A_Context, A_Feature, A_Inject } from '@adaas/a-concept';

// Example 1: Basic Channel Usage
async function basicChannelExample() {
    console.log('\n=== Basic Channel Example ===');
    
    const channel = new A_Channel();
    A_Context.root.register(channel);

    // Initialize the channel
    await channel.initialize;
    console.log(`Channel initialized, processing: ${channel.processing}`);

    // Send a request
    const response = await channel.request({
        action: 'greet',
        name: 'World'
    });

    console.log('Request params:', response.params);
}

// Example 2: HTTP Client Channel
interface HttpRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
    body?: any;
}

interface HttpResponse {
    status: number;
    statusText: string;
    data: any;
    headers: Record<string, string>;
}

class HttpChannel extends A_Channel {}

class HttpProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [HttpChannel] })
    async [A_ChannelFeatures.onConnect]() {
        console.log('HTTP Channel connected - ready to make requests');
    }
    
    @A_Feature.Extend({ scope: [HttpChannel] })
    async [A_ChannelFeatures.onBeforeRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<HttpRequest>
    ) {
        const { method, url } = context.params;
        console.log(`Preparing ${method} request to ${url}`);
        
        // Validate URL
        if (!url || !url.startsWith('http')) {
            throw new Error('Invalid URL provided');
        }
    }
    
    @A_Feature.Extend({ scope: [HttpChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<HttpRequest, HttpResponse>
    ) {
        const { method, url, headers, body } = context.params;
        
        console.log(`Making ${method} request to ${url}`);
        
        // Simulate HTTP request (in real implementation, use fetch or axios)
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
        
        const mockResponse: HttpResponse = {
            status: 200,
            statusText: 'OK',
            data: {
                success: true,
                method,
                url,
                timestamp: new Date().toISOString()
            },
            headers: {
                'content-type': 'application/json',
                'x-response-time': '100ms'
            }
        };
        
        context.succeed(mockResponse);
    }
    
    @A_Feature.Extend({ scope: [HttpChannel] })
    async [A_ChannelFeatures.onAfterRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<HttpRequest, HttpResponse>
    ) {
        const response = context.data;
        console.log(`Request completed with status: ${response?.status}`);
    }
    
    @A_Feature.Extend({ scope: [HttpChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<HttpRequest>
    ) {
        console.error(`HTTP request failed for ${context.params.method} ${context.params.url}`);
    }
}

async function httpChannelExample() {
    console.log('\n=== HTTP Channel Example ===');
    
    A_Context.reset();
    A_Context.root.register(HttpProcessor);
    
    const httpChannel = new HttpChannel();
    A_Context.root.register(httpChannel);

    // Make GET request
    const getResponse = await httpChannel.request<HttpRequest, HttpResponse>({
        method: 'GET',
        url: 'https://api.example.com/users'
    });

    console.log('GET Response:', getResponse.data);

    // Make POST request
    const postResponse = await httpChannel.request<HttpRequest, HttpResponse>({
        method: 'POST',
        url: 'https://api.example.com/users',
        body: { name: 'John Doe', email: 'john@example.com' }
    });

    console.log('POST Response:', postResponse.data);
}

// Example 3: Event Broadcasting Channel
interface EventMessage {
    eventType: string;
    payload: any;
    recipients: string[];
    priority?: 'low' | 'normal' | 'high';
}

class EventChannel extends A_Channel {}

class EventBroadcaster extends A_Component {
    
    @A_Feature.Extend({ scope: [EventChannel] })
    async [A_ChannelFeatures.onConnect]() {
        console.log('Event Broadcasting Channel connected');
    }
    
    @A_Feature.Extend({ scope: [EventChannel] })
    async [A_ChannelFeatures.onSend](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<EventMessage>
    ) {
        const { eventType, payload, recipients, priority = 'normal' } = context.params;
        
        console.log(`Broadcasting ${eventType} event to ${recipients.length} recipients`);
        console.log(`Priority: ${priority}`);
        
        // Simulate broadcasting to each recipient
        for (const recipient of recipients) {
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate send delay
            console.log(`✓ Sent to ${recipient}`);
        }
        
        console.log(`Event ${eventType} broadcast completed`);
    }
    
    @A_Feature.Extend({ scope: [EventChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<EventMessage>
    ) {
        console.error(`Failed to broadcast event: ${context.params.eventType}`);
    }
}

async function eventChannelExample() {
    console.log('\n=== Event Broadcasting Channel Example ===');
    
    A_Context.reset();
    A_Context.root.register(EventBroadcaster);
    
    const eventChannel = new EventChannel();
    A_Context.root.register(eventChannel);

    // Broadcast user login event
    await eventChannel.send({
        eventType: 'user.login',
        payload: {
            userId: 'user-123',
            loginTime: new Date().toISOString(),
            ipAddress: '192.168.1.1'
        },
        recipients: ['admin@example.com', 'security@example.com'],
        priority: 'normal'
    });

    // Broadcast critical alert
    await eventChannel.send({
        eventType: 'system.alert',
        payload: {
            severity: 'critical',
            message: 'Database connection lost',
            timestamp: new Date().toISOString()
        },
        recipients: ['ops@example.com', 'admin@example.com', 'oncall@example.com'],
        priority: 'high'
    });
}

// Example 4: Database Channel with Connection Pooling
interface DatabaseQuery {
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
    table: string;
    where?: Record<string, any>;
    data?: Record<string, any>;
    limit?: number;
}

interface DatabaseResult {
    success: boolean;
    rowsAffected: number;
    data?: any[];
    insertId?: number;
    executionTime: number;
}

class DatabaseChannel extends A_Channel {
    private connectionPool: Array<{ id: string; busy: boolean }> = [];
    
    getAvailableConnection() {
        return this.connectionPool.find(conn => !conn.busy);
    }
    
    getPoolStats() {
        return {
            total: this.connectionPool.length,
            busy: this.connectionPool.filter(conn => conn.busy).length,
            available: this.connectionPool.filter(conn => !conn.busy).length
        };
    }
}

class DatabaseProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [DatabaseChannel] })
    async [A_ChannelFeatures.onConnect]() {
        const channel = A_Context.scope(this).resolve(DatabaseChannel)!;
        
        // Initialize connection pool
        for (let i = 0; i < 5; i++) {
            channel['connectionPool'].push({
                id: `conn-${i}`,
                busy: false
            });
        }
        
        console.log('Database Channel connected with 5 connections in pool');
    }
    
    @A_Feature.Extend({ scope: [DatabaseChannel] })
    async [A_ChannelFeatures.onBeforeRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<DatabaseQuery>
    ) {
        const channel = A_Context.scope(this).resolve(DatabaseChannel)!;
        const { operation, table } = context.params;
        
        console.log(`Executing ${operation} on table ${table}`);
        
        // Check for available connection
        const availableConn = channel.getAvailableConnection();
        if (!availableConn) {
            throw new Error('No available database connections');
        }
        
        // Reserve connection
        availableConn.busy = true;
        (context as any)._connection = availableConn;
        
        console.log(`Using connection: ${availableConn.id}`);
        console.log('Pool stats:', channel.getPoolStats());
    }
    
    @A_Feature.Extend({ scope: [DatabaseChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<DatabaseQuery, DatabaseResult>
    ) {
        const { operation, table, where, data, limit } = context.params;
        const startTime = Date.now();
        
        // Simulate database operation
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
        
        const executionTime = Date.now() - startTime;
        let result: DatabaseResult;
        
        switch (operation) {
            case 'SELECT':
                result = {
                    success: true,
                    rowsAffected: 0,
                    data: [
                        { id: 1, name: 'John Doe', email: 'john@example.com' },
                        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
                    ].slice(0, limit || 10),
                    executionTime
                };
                break;
                
            case 'INSERT':
                result = {
                    success: true,
                    rowsAffected: 1,
                    insertId: Math.floor(Math.random() * 1000) + 1,
                    executionTime
                };
                break;
                
            case 'UPDATE':
            case 'DELETE':
                result = {
                    success: true,
                    rowsAffected: Math.floor(Math.random() * 5) + 1,
                    executionTime
                };
                break;
                
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
        
        context.succeed(result);
    }
    
    @A_Feature.Extend({ scope: [DatabaseChannel] })
    async [A_ChannelFeatures.onAfterRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<DatabaseQuery, DatabaseResult>
    ) {
        // Release connection
        const connection = (context as any)._connection;
        if (connection) {
            connection.busy = false;
            console.log(`Released connection: ${connection.id}`);
        }
        
        const result = context.data;
        console.log(`Query completed in ${result?.executionTime}ms, affected ${result?.rowsAffected} rows`);
    }
    
    @A_Feature.Extend({ scope: [DatabaseChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<DatabaseQuery>
    ) {
        // Release connection on error
        const connection = (context as any)._connection;
        if (connection) {
            connection.busy = false;
            console.log(`Released connection after error: ${connection.id}`);
        }
        
        console.error(`Database operation failed: ${context.params.operation} on ${context.params.table}`);
    }
}

async function databaseChannelExample() {
    console.log('\n=== Database Channel Example ===');
    
    A_Context.reset();
    A_Context.root.register(DatabaseProcessor);
    
    const dbChannel = new DatabaseChannel();
    A_Context.root.register(dbChannel);

    // Execute multiple queries concurrently
    const queries = [
        dbChannel.request<DatabaseQuery, DatabaseResult>({
            operation: 'SELECT',
            table: 'users',
            where: { active: true },
            limit: 10
        }),
        
        dbChannel.request<DatabaseQuery, DatabaseResult>({
            operation: 'INSERT',
            table: 'users',
            data: { name: 'Alice Johnson', email: 'alice@example.com' }
        }),
        
        dbChannel.request<DatabaseQuery, DatabaseResult>({
            operation: 'UPDATE',
            table: 'users',
            where: { id: 1 },
            data: { lastLogin: new Date().toISOString() }
        })
    ];

    const results = await Promise.all(queries);
    
    results.forEach((result, index) => {
        const operation = ['SELECT', 'INSERT', 'UPDATE'][index];
        console.log(`${operation} result:`, result.data);
    });
    
    console.log('Final pool stats:', dbChannel.getPoolStats());
}

// Example 5: Error Handling and Recovery
class RobustChannel extends A_Channel {}

class RobustProcessor extends A_Component {
    private retryCount = new Map<string, number>();
    
    @A_Feature.Extend({ scope: [RobustChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const { operation, shouldFail } = context.params;
        
        if (shouldFail) {
            const errorType = Math.random() > 0.5 ? 'network' : 'timeout';
            throw new Error(`Simulated ${errorType} error`);
        }
        
        (context as any)._result = {
            success: true,
            operation,
            processedAt: new Date().toISOString()
        };
    }
    
    @A_Feature.Extend({ scope: [RobustChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const requestId = JSON.stringify(context.params);
        const currentRetries = this.retryCount.get(requestId) || 0;
        const maxRetries = 3;
        
        console.log(`Error occurred (attempt ${currentRetries + 1}/${maxRetries + 1}):`, context.error?.message);
        
        if (currentRetries < maxRetries) {
            this.retryCount.set(requestId, currentRetries + 1);
            console.log(`Implementing retry logic for attempt ${currentRetries + 2}`);
            // In a real implementation, you might retry the operation here
        } else {
            console.log('Max retries exceeded, giving up');
            this.retryCount.delete(requestId);
        }
    }
}

async function errorHandlingExample() {
    console.log('\n=== Error Handling and Recovery Example ===');
    
    A_Context.reset();
    A_Context.root.register(RobustProcessor);
    
    const robustChannel = new RobustChannel();
    A_Context.root.register(robustChannel);

    // Test successful operation
    const successResult = await robustChannel.request({
        operation: 'process-data',
        shouldFail: false
    });
    
    console.log('Success result:', successResult.data);

    // Test failing operation
    try {
        const failResult = await robustChannel.request({
            operation: 'process-data',
            shouldFail: true
        });
        
        console.log('Fail result status:', failResult.status);
    } catch (error) {
        console.log('Request failed as expected:', (error as Error).message);
    }
}

// Run all examples
async function runAllExamples() {
    console.log('🚀 Running A-Channel Examples\n');
    
    try {
        await basicChannelExample();
        await httpChannelExample();
        await eventChannelExample();
        await databaseChannelExample();
        await errorHandlingExample();
        
        console.log('\n✅ All A-Channel examples completed successfully!');
    } catch (error) {
        console.error('\n❌ Example failed:', error);
    }
}

// Export for use as module or run directly
export {
    basicChannelExample,
    httpChannelExample,
    eventChannelExample,
    databaseChannelExample,
    errorHandlingExample,
    runAllExamples
};

// Run if this file is executed directly
if (require.main === module) {
    runAllExamples();
}