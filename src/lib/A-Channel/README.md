# A-Channel

A powerful, extensible communication channel component that provides structured messaging patterns with lifecycle management, error handling, and type safety for TypeScript applications.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Channel Lifecycle](#channel-lifecycle)
- [Request Processing](#request-processing)
- [Send Operations](#send-operations)
- [Error Handling](#error-handling)
- [Type Safety](#type-safety)
- [Extension and Customization](#extension-and-customization)
- [API Reference](#api-reference)
- [Examples](#examples)

## Overview

A-Channel implements communication patterns that allow you to encapsulate messaging operations as structured, extensible components. It provides a foundation for building various types of communication channels (HTTP, WebSocket, Message Queues, etc.) with consistent lifecycle management and error handling.

## Key Features

- 🔄 **Lifecycle Management** - Complete connection and processing lifecycle with hooks
- 📡 **Multiple Communication Patterns** - Request/Response and Fire-and-Forget messaging
- 🛡️ **Error Handling** - Comprehensive error capture and management
- 🎯 **Type Safety** - Full TypeScript support with generic types
- 🔧 **Extensible** - Component-based architecture for custom behavior
- ⚡ **Concurrent Processing** - Handle multiple requests simultaneously
- 📊 **Processing State** - Built-in state tracking and management
- 🏗️ **Dependency Injection** - Integration with A-Context for scope management

## Installation

```bash
npm install @adaas/a-utils
```

## Basic Usage

### Simple Channel Creation

```typescript
import { A_Channel } from '@adaas/a-utils/lib/A-Channel/A-Channel.component';
import { A_Context } from '@adaas/a-concept';

// Create a basic channel
const channel = new A_Channel();
A_Context.root.register(channel);

// Initialize the channel
await channel.initialize;

console.log(`Channel ready, processing: ${channel.processing}`);
```

### Basic Request/Response

```typescript
// Send a request and get response
const response = await channel.request({
    action: 'getUserData',
    userId: '12345'
});

console.log('Request params:', response.params);
console.log('Response data:', response.data);
console.log('Request status:', response.status);
```

### Fire-and-Forget Messaging

```typescript
// Send a message without waiting for response
await channel.send({
    type: 'notification',
    message: 'User logged in',
    timestamp: new Date().toISOString()
});

console.log('Message sent successfully');
```

## Advanced Usage

### Custom Channel with Business Logic

```typescript
import { A_Component, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_ChannelFeatures } from '@adaas/a-utils/lib/A-Channel/A-Channel.constants';
import { A_ChannelRequest } from '@adaas/a-utils/lib/A-Channel/A-ChannelRequest.context';

// Define typed interfaces
interface UserRequest {
    action: 'create' | 'update' | 'delete';
    userId: string;
    userData?: any;
}

interface UserResponse {
    success: boolean;
    userId: string;
    message: string;
    timestamp: string;
}

// Create custom channel
class UserManagementChannel extends A_Channel {}

// Create custom processor
class UserProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [UserManagementChannel] })
    async [A_ChannelFeatures.onConnect]() {
        console.log('User management channel connected');
        // Initialize database connections, validate configuration, etc.
    }
    
    @A_Feature.Extend({ scope: [UserManagementChannel] })
    async [A_ChannelFeatures.onBeforeRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<UserRequest>
    ) {
        // Validate request
        const { action, userId } = context.params;
        if (!userId) {
            throw new Error('User ID is required');
        }
        console.log(`Processing ${action} for user ${userId}`);
    }
    
    @A_Feature.Extend({ scope: [UserManagementChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<UserRequest, UserResponse>
    ) {
        const { action, userId, userData } = context.params;
        
        // Simulate business logic
        let message = '';
        switch (action) {
            case 'create':
                message = `User ${userId} created successfully`;
                break;
            case 'update':
                message = `User ${userId} updated successfully`;
                break;
            case 'delete':
                message = `User ${userId} deleted successfully`;
                break;
        }
        
        // Set response data
        (context as any)._result = {
            success: true,
            userId,
            message,
            timestamp: new Date().toISOString()
        };
    }
    
    @A_Feature.Extend({ scope: [UserManagementChannel] })
    async [A_ChannelFeatures.onAfterRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<UserRequest, UserResponse>
    ) {
        // Log successful completion
        console.log(`Request completed: ${context.data?.message}`);
    }
    
    @A_Feature.Extend({ scope: [UserManagementChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<UserRequest>
    ) {
        console.error(`Request failed for action: ${context.params.action}`);
        // Log error, send alerts, etc.
    }
}

// Usage
A_Context.reset();
A_Context.root.register(UserProcessor);

const userChannel = new UserManagementChannel();
A_Context.root.register(userChannel);

// Process user requests
const createResponse = await userChannel.request<UserRequest, UserResponse>({
    action: 'create',
    userId: 'user-123',
    userData: { name: 'John Doe', email: 'john@example.com' }
});

console.log('User created:', createResponse.data);
```

## Channel Lifecycle

A-Channel follows a structured lifecycle with multiple extension points:

### Connection Lifecycle

```typescript
class LifecycleChannel extends A_Channel {}

class LifecycleProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [LifecycleChannel] })
    async [A_ChannelFeatures.onConnect]() {
        console.log('1. Channel connecting...');
        // Initialize connections, load configuration, validate environment
    }
    
    @A_Feature.Extend({ scope: [LifecycleChannel] })
    async [A_ChannelFeatures.onDisconnect]() {
        console.log('6. Channel disconnecting...');
        // Cleanup resources, close connections, save state
    }
}

const channel = new LifecycleChannel();
A_Context.root.register(LifecycleProcessor);
A_Context.root.register(channel);

// Initialize (calls onConnect)
await channel.initialize;

// Use channel for requests...

// Cleanup (calls onDisconnect)
await channel.disconnect();
```

### Request Lifecycle

```typescript
class RequestLifecycleProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [LifecycleChannel] })
    async [A_ChannelFeatures.onBeforeRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        console.log('2. Pre-processing request...');
        // Validate input, authenticate, rate limiting
    }
    
    @A_Feature.Extend({ scope: [LifecycleChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        console.log('3. Processing request...');
        // Main business logic
    }
    
    @A_Feature.Extend({ scope: [LifecycleChannel] })
    async [A_ChannelFeatures.onAfterRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        console.log('4. Post-processing request...');
        // Logging, analytics, cleanup
    }
    
    @A_Feature.Extend({ scope: [LifecycleChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        console.log('5. Handling error...');
        // Error logging, alerts, recovery
    }
}
```

## Request Processing

### Synchronous Request/Response

```typescript
class APIChannel extends A_Channel {}

class APIProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [APIChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const { endpoint, method, body } = context.params;
        
        // Simulate API call
        const response = await fetch(endpoint, {
            method,
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        (context as any)._result = {
            status: response.status,
            data,
            headers: Object.fromEntries(response.headers.entries())
        };
    }
}

A_Context.root.register(APIProcessor);

const apiChannel = new APIChannel();
A_Context.root.register(apiChannel);

const response = await apiChannel.request({
    endpoint: 'https://api.example.com/users',
    method: 'GET'
});

console.log('API Response:', response.data);
```

### Concurrent Request Processing

```typescript
// Process multiple requests concurrently
const requests = [
    apiChannel.request({ endpoint: '/users/1', method: 'GET' }),
    apiChannel.request({ endpoint: '/users/2', method: 'GET' }),
    apiChannel.request({ endpoint: '/users/3', method: 'GET' })
];

const responses = await Promise.all(requests);
responses.forEach((response, index) => {
    console.log(`User ${index + 1}:`, response.data);
});
```

## Send Operations

### Event Broadcasting

```typescript
class EventChannel extends A_Channel {}

class EventBroadcaster extends A_Component {
    
    @A_Feature.Extend({ scope: [EventChannel] })
    async [A_ChannelFeatures.onSend](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const { eventType, payload, recipients } = context.params;
        
        console.log(`Broadcasting ${eventType} to ${recipients.length} recipients`);
        
        // Simulate broadcasting
        for (const recipient of recipients) {
            console.log(`Sending to ${recipient}:`, payload);
            // Send to message queue, WebSocket, email service, etc.
        }
    }
}

A_Context.root.register(EventBroadcaster);

const eventChannel = new EventChannel();
A_Context.root.register(eventChannel);

// Send notification to multiple users
await eventChannel.send({
    eventType: 'user.login',
    payload: { userId: '123', timestamp: new Date() },
    recipients: ['admin@example.com', 'user@example.com']
});
```

### Message Queuing

```typescript
class QueueChannel extends A_Channel {}

class MessageQueue extends A_Component {
    private queue: any[] = [];
    
    @A_Feature.Extend({ scope: [QueueChannel] })
    async [A_ChannelFeatures.onSend](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const message = {
            id: Date.now(),
            payload: context.params,
            timestamp: new Date(),
            retries: 0
        };
        
        this.queue.push(message);
        console.log(`Queued message ${message.id}, queue size: ${this.queue.length}`);
        
        // Process queue asynchronously
        setImmediate(() => this.processQueue());
    }
    
    private async processQueue() {
        while (this.queue.length > 0) {
            const message = this.queue.shift();
            try {
                await this.processMessage(message);
                console.log(`Processed message ${message.id}`);
            } catch (error) {
                console.error(`Failed to process message ${message.id}:`, error);
                // Implement retry logic
            }
        }
    }
    
    private async processMessage(message: any) {
        // Simulate message processing
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

A_Context.root.register(MessageQueue);

const queueChannel = new QueueChannel();
A_Context.root.register(queueChannel);

// Send messages to queue
await queueChannel.send({ type: 'email', to: 'user@example.com' });
await queueChannel.send({ type: 'sms', to: '+1234567890' });
```

## Error Handling

### Comprehensive Error Management

```typescript
import { A_ChannelError } from '@adaas/a-utils/lib/A-Channel/A-Channel.error';

class RobustChannel extends A_Channel {}

class ErrorHandler extends A_Component {
    
    @A_Feature.Extend({ scope: [RobustChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const { operation } = context.params;
        
        switch (operation) {
            case 'network_error':
                throw new Error('Network connection failed');
            case 'validation_error':
                throw new Error('Invalid input data');
            case 'timeout_error':
                throw new Error('Operation timed out');
            case 'success':
                (context as any)._result = { success: true };
                break;
            default:
                throw new Error('Unknown operation');
        }
    }
    
    @A_Feature.Extend({ scope: [RobustChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        console.log('Error details:', {
            operation: context.params.operation,
            failed: context.failed,
            status: context.status
        });
        
        // Implement error recovery, alerting, logging
        if (context.params.operation === 'network_error') {
            console.log('Implementing network retry logic...');
        }
    }
}

A_Context.root.register(ErrorHandler);

const robustChannel = new RobustChannel();
A_Context.root.register(robustChannel);

// Test error handling
const operations = ['success', 'network_error', 'validation_error'];

for (const operation of operations) {
    const result = await robustChannel.request({ operation });
    
    if (result.failed) {
        console.log(`Operation ${operation} failed as expected`);
    } else {
        console.log(`Operation ${operation} succeeded:`, result.data);
    }
}
```

## Type Safety

### Strongly Typed Channels

```typescript
// Define strict interfaces
interface DatabaseQuery {
    table: string;
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
    where?: Record<string, any>;
    data?: Record<string, any>;
}

interface DatabaseResult {
    success: boolean;
    rowsAffected: number;
    data?: any[];
    insertId?: number;
}

class DatabaseChannel extends A_Channel {}

class DatabaseProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [DatabaseChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<DatabaseQuery, DatabaseResult>
    ) {
        const { table, operation, where, data } = context.params;
        
        // Type-safe access to parameters
        console.log(`Executing ${operation} on table ${table}`);
        
        // Simulate database operation
        let result: DatabaseResult;
        
        switch (operation) {
            case 'SELECT':
                result = {
                    success: true,
                    rowsAffected: 0,
                    data: [{ id: 1, name: 'Test' }]
                };
                break;
            case 'INSERT':
                result = {
                    success: true,
                    rowsAffected: 1,
                    insertId: 123
                };
                break;
            default:
                result = {
                    success: true,
                    rowsAffected: 1
                };
        }
        
        (context as any)._result = result;
    }
}

A_Context.root.register(DatabaseProcessor);

const dbChannel = new DatabaseChannel();
A_Context.root.register(dbChannel);

// Type-safe requests
const selectResult = await dbChannel.request<DatabaseQuery, DatabaseResult>({
    table: 'users',
    operation: 'SELECT',
    where: { active: true }
});

// TypeScript provides full intellisense and type checking
if (selectResult.data?.success) {
    console.log('Selected rows:', selectResult.data.data?.length);
}

const insertResult = await dbChannel.request<DatabaseQuery, DatabaseResult>({
    table: 'users',
    operation: 'INSERT',
    data: { name: 'John Doe', email: 'john@example.com' }
});

if (insertResult.data?.success) {
    console.log('Inserted user with ID:', insertResult.data.insertId);
}
```

## Extension and Customization

### Multi-Feature Channel

```typescript
class AdvancedChannel extends A_Channel {
    private metrics = { requests: 0, errors: 0, totalTime: 0 };
    
    getMetrics() {
        return { ...this.metrics };
    }
    
    resetMetrics() {
        this.metrics = { requests: 0, errors: 0, totalTime: 0 };
    }
}

class MetricsCollector extends A_Component {
    
    @A_Feature.Extend({ scope: [AdvancedChannel] })
    async [A_ChannelFeatures.onBeforeRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        (context as any)._startTime = Date.now();
    }
    
    @A_Feature.Extend({ scope: [AdvancedChannel] })
    async [A_ChannelFeatures.onAfterRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const channel = A_Context.scope(this).resolve(AdvancedChannel);
        const duration = Date.now() - (context as any)._startTime;
        
        channel['metrics'].requests++;
        channel['metrics'].totalTime += duration;
    }
    
    @A_Feature.Extend({ scope: [AdvancedChannel] })
    async [A_ChannelFeatures.onError](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const channel = A_Context.scope(this).resolve(AdvancedChannel);
        channel['metrics'].errors++;
    }
}

class CacheLayer extends A_Component {
    private cache = new Map<string, any>();
    
    @A_Feature.Extend({ scope: [AdvancedChannel] })
    async [A_ChannelFeatures.onBeforeRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const cacheKey = JSON.stringify(context.params);
        
        if (this.cache.has(cacheKey)) {
            console.log('Cache hit!');
            (context as any)._result = this.cache.get(cacheKey);
            (context as any)._cached = true;
        }
    }
    
    @A_Feature.Extend({ scope: [AdvancedChannel] })
    async [A_ChannelFeatures.onAfterRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        if (!(context as any)._cached && context.data) {
            const cacheKey = JSON.stringify(context.params);
            this.cache.set(cacheKey, context.data);
            console.log('Cached result');
        }
    }
}

// Register multiple processors
A_Context.root.register(MetricsCollector);
A_Context.root.register(CacheLayer);

const advancedChannel = new AdvancedChannel();
A_Context.root.register(advancedChannel);

// Use channel with metrics and caching
await advancedChannel.request({ action: 'getData', id: 1 });
await advancedChannel.request({ action: 'getData', id: 1 }); // Cache hit
await advancedChannel.request({ action: 'getData', id: 2 });

console.log('Metrics:', advancedChannel.getMetrics());
```

## API Reference

### A_Channel Class

#### Properties
- `processing: boolean` - Indicates if channel is currently processing requests
- `initialize: Promise<void>` - Promise that resolves when channel is initialized

#### Methods

##### Connection Management
- `async connect(): Promise<void>` - Initialize the channel
- `async disconnect(): Promise<void>` - Cleanup and disconnect the channel

##### Communication
- `async request<T, R>(params: T): Promise<A_ChannelRequest<T, R>>` - Send request and wait for response
- `async send<T>(message: T): Promise<void>` - Send fire-and-forget message

#### Lifecycle Hooks (Extensible via A_Feature)
- `onConnect` - Called during channel initialization
- `onDisconnect` - Called during channel cleanup
- `onBeforeRequest` - Called before processing request
- `onRequest` - Called to process request
- `onAfterRequest` - Called after processing request
- `onSend` - Called to process send operation
- `onError` - Called when any operation fails

### A_ChannelRequest Class

#### Properties
- `params: T` - Request parameters
- `data: R` - Response data (after processing)
- `status: A_ChannelRequestStatuses` - Request status (PENDING, SUCCESS, FAILED)
- `failed: boolean` - Whether the request failed

#### Methods
- `fail(error: Error): void` - Mark request as failed

### Constants

#### A_ChannelRequestStatuses
```typescript
enum A_ChannelRequestStatuses {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}
```

## Examples

### HTTP Client Channel

```typescript
class HttpChannel extends A_Channel {
    constructor(private baseUrl: string, private defaultHeaders: Record<string, string> = {}) {
        super();
    }
    
    async get(path: string, headers?: Record<string, string>) {
        return this.request({
            method: 'GET',
            url: `${this.baseUrl}${path}`,
            headers: { ...this.defaultHeaders, ...headers }
        });
    }
    
    async post(path: string, body: any, headers?: Record<string, string>) {
        return this.request({
            method: 'POST',
            url: `${this.baseUrl}${path}`,
            body,
            headers: { ...this.defaultHeaders, ...headers }
        });
    }
}

class HttpProcessor extends A_Component {
    @A_Feature.Extend({ scope: [HttpChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const { method, url, body, headers } = context.params;
        
        const response = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });
        
        const data = await response.json();
        
        (context as any)._result = {
            status: response.status,
            statusText: response.statusText,
            data,
            headers: Object.fromEntries(response.headers.entries())
        };
    }
}

// Usage
A_Context.root.register(HttpProcessor);

const httpClient = new HttpChannel('https://api.example.com', {
    'Authorization': 'Bearer token123'
});
A_Context.root.register(httpClient);

const userResponse = await httpClient.get('/users/123');
console.log('User data:', userResponse.data);

const createResponse = await httpClient.post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
});
console.log('Created user:', createResponse.data);
```

### WebSocket Channel

```typescript
class WebSocketChannel extends A_Channel {
    private ws?: WebSocket;
    
    async connectWebSocket(url: string) {
        return new Promise<void>((resolve, reject) => {
            this.ws = new WebSocket(url);
            this.ws.onopen = () => resolve();
            this.ws.onerror = (error) => reject(error);
        });
    }
}

class WebSocketProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [WebSocketChannel] })
    async [A_ChannelFeatures.onConnect]() {
        const channel = A_Context.scope(this).resolve(WebSocketChannel);
        await channel.connectWebSocket('ws://localhost:8080');
        console.log('WebSocket connected');
    }
    
    @A_Feature.Extend({ scope: [WebSocketChannel] })
    async [A_ChannelFeatures.onSend](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const channel = A_Context.scope(this).resolve(WebSocketChannel);
        const message = JSON.stringify(context.params);
        
        if (channel['ws']?.readyState === WebSocket.OPEN) {
            channel['ws'].send(message);
            console.log('Message sent via WebSocket');
        } else {
            throw new Error('WebSocket not connected');
        }
    }
}

// Usage
A_Context.root.register(WebSocketProcessor);

const wsChannel = new WebSocketChannel();
A_Context.root.register(wsChannel);

await wsChannel.initialize;

await wsChannel.send({
    type: 'chat',
    message: 'Hello WebSocket!',
    timestamp: new Date().toISOString()
});
```

---

## Contributing

When extending A-Channel functionality, please ensure:

1. All new features include comprehensive tests
2. TypeScript types are properly defined and exported
3. Documentation is updated for new APIs
4. Examples are provided for complex features
5. Backward compatibility is maintained

## License

This project is licensed under the MIT License - see the LICENSE file for details.