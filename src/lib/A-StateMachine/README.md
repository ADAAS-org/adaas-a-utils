# A_StateMachine

A powerful and flexible state machine implementation that allows you to define and manage complex state transitions with validation, hooks, and error handling.

## Overview

`A_StateMachine` is a TypeScript-based state machine that extends `A_Component` from the `@adaas/a-concept` framework. It provides a robust foundation for implementing state-driven workflows with proper lifecycle management, error handling, and extensibility through hooks.

## Features

- ✅ **Type-safe state definitions** - Define states and their associated data types using TypeScript interfaces
- ✅ **Lifecycle hooks** - Extend behavior with initialization, pre/post-transition, and error handling hooks
- ✅ **Asynchronous transitions** - Full async/await support for complex state transitions
- ✅ **Isolated scopes** - Each transition runs in its own scope with proper cleanup
- ✅ **Error handling** - Comprehensive error wrapping and handling with custom error types
- ✅ **Extensible** - Use the feature system to add custom transition logic and validation

## Installation

```bash
npm install @adaas/a-utils
```

## Basic Usage

### 1. Define State Types

```typescript
interface TrafficLightStates {
  red: { duration: number };
  yellow: { duration: number; fromState: 'red' | 'green' };
  green: { duration: number };
}
```

### 2. Create State Machine

```typescript
import { A_StateMachine } from '@adaas/a-utils/lib/A-StateMachine';

class TrafficLightMachine extends A_StateMachine<TrafficLightStates> {
  // The state machine is ready to use with basic functionality
}

const trafficLight = new TrafficLightMachine();
```

### 3. Execute Transitions

```typescript
// Wait for initialization
await trafficLight.ready;

// Execute transitions
await trafficLight.transition('red', 'green', { duration: 30000 });
await trafficLight.transition('green', 'yellow', { 
  duration: 3000, 
  fromState: 'green' 
});
await trafficLight.transition('yellow', 'red', { duration: 60000 });
```

## Advanced Usage

### Custom Transition Logic

Define custom logic for specific transitions by implementing methods following the naming convention `{fromState}_{toState}`:

```typescript
class OrderStateMachine extends A_StateMachine<OrderStates> {
  
  // Custom transition from pending to processing
  async pending_processing(scope: A_Scope): Promise<void> {
    const operation = scope.resolve(A_OperationContext)!;
    const { orderId, processedBy } = operation.props;
    
    // Validate the transition
    if (!processedBy) {
      throw new Error('processedBy is required for processing transition');
    }
    
    // Custom business logic
    console.log(`Order ${orderId} is now being processed by ${processedBy}`);
    
    // You can set results in the operation context
    operation.result = { processedAt: new Date() };
  }
  
  // Custom transition from processing to completed
  async processing_completed(scope: A_Scope): Promise<void> {
    const operation = scope.resolve(A_OperationContext)!;
    const { orderId } = operation.props;
    
    // Finalization logic
    console.log(`Order ${orderId} has been completed`);
  }
}
```

### Lifecycle Hooks

Extend the state machine with hooks that run at specific points in the transition lifecycle:

```typescript
class MonitoredStateMachine extends A_StateMachine<MyStates> {
  
  @A_Feature.Extend()
  async [A_StateMachineFeatures.onInitialize](): Promise<void> {
    console.log('State machine initialized');
    // Custom initialization logic
  }
  
  @A_Feature.Extend()
  async [A_StateMachineFeatures.onBeforeTransition](scope: A_Scope): Promise<void> {
    const operation = scope.resolve(A_OperationContext)!;
    console.log(`About to transition from ${operation.props.from} to ${operation.props.to}`);
    
    // Add validation logic
    await this.validateTransition(operation.props.from, operation.props.to);
  }
  
  @A_Feature.Extend()
  async [A_StateMachineFeatures.onAfterTransition](scope: A_Scope): Promise<void> {
    const operation = scope.resolve(A_OperationContext)!;
    console.log(`Successfully transitioned to ${operation.props.to}`);
    
    // Log to audit system, update metrics, etc.
    await this.logTransition(operation);
  }
  
  @A_Feature.Extend()
  async [A_StateMachineFeatures.onError](scope: A_Scope): Promise<void> {
    const error = scope.resolve(A_StateMachineError);
    console.error('Transition failed:', error?.message);
    
    // Custom error handling - notifications, cleanup, etc.
    await this.handleTransitionError(error);
  }
  
  private async validateTransition(from: keyof MyStates, to: keyof MyStates): Promise<void> {
    // Custom validation logic
  }
  
  private async logTransition(operation: A_OperationContext): Promise<void> {
    // Custom logging logic
  }
  
  private async handleTransitionError(error: A_StateMachineError | undefined): Promise<void> {
    // Custom error handling logic
  }
}
```

### External Components

You can also extend state machine behavior using external components:

```typescript
@A_Component()
class StateLogger extends A_Component {
  
  @A_Feature.Extend({ scope: [OrderStateMachine] })
  async [A_StateMachineFeatures.onBeforeTransition](scope: A_Scope): Promise<void> {
    const operation = scope.resolve(A_OperationContext)!;
    console.log(`[LOGGER] Transition: ${operation.props.from} -> ${operation.props.to}`);
  }
  
  @A_Feature.Extend({ scope: [OrderStateMachine] })
  async [A_StateMachineFeatures.onError](scope: A_Scope): Promise<void> {
    const error = scope.resolve(A_StateMachineError);
    console.error(`[LOGGER] Transition error: ${error?.message}`);
  }
}

// Register the component in your context
A_Context.root.register(StateLogger);
```

## API Reference

### Class: A_StateMachine<T>

#### Type Parameters

- `T extends Record<string, any>` - Defines the state structure where keys are state names and values are the data types for each state.

#### Properties

##### `ready: Promise<void>`

A promise that resolves when the state machine is fully initialized and ready for transitions.

```typescript
await stateMachine.ready;
```

#### Methods

##### `transition(from, to, props?): Promise<void>`

Executes a state transition.

**Parameters:**
- `from: keyof T` - The state to transition from
- `to: keyof T` - The state to transition to  
- `props?: T[keyof T]` - Optional properties for the transition

**Returns:** `Promise<void>`

**Throws:** `A_StateMachineError` if the transition fails

#### Lifecycle Hooks

##### `onInitialize(...args: any[]): Promise<void>`

Called during state machine initialization.

##### `onBeforeTransition(...args: any[]): Promise<void>`

Called before every transition. Receives the transition scope as an argument.

##### `onAfterTransition(...args: any[]): Promise<void>`

Called after successful transitions. Receives the transition scope as an argument.

##### `onError(...args: any[]): Promise<void>`

Called when transitions fail. Receives the error scope as an argument.

### Transition Method Convention

For custom transition logic, implement methods using the naming convention:

```
{fromState}_{toState}(scope: A_Scope): Promise<void>
```

Example:
```typescript
async pending_processing(scope: A_Scope): Promise<void> {
  // Custom transition logic
}
```

## Error Handling

The state machine provides comprehensive error handling:

### A_StateMachineError

All transition errors are wrapped in `A_StateMachineError` instances:

```typescript
try {
  await stateMachine.transition('invalid', 'state');
} catch (error) {
  if (error instanceof A_StateMachineError) {
    console.log('Error type:', error.title);
    console.log('Description:', error.description);
    console.log('Original error:', error.originalError);
  }
}
```

### Error Types

- `A_StateMachineError.InitializationError` - Errors during initialization
- `A_StateMachineError.TransitionError` - Errors during state transitions

## Best Practices

### 1. Define Clear State Interfaces

```typescript
interface DocumentStates {
  draft: { 
    content: string; 
    authorId: string; 
  };
  review: { 
    content: string; 
    authorId: string; 
    reviewerId: string; 
    requestedAt: Date; 
  };
  published: { 
    content: string; 
    authorId: string; 
    publishedAt: Date; 
    version: number; 
  };
  archived: { 
    content: string; 
    authorId: string; 
    archivedAt: Date; 
    reason: string; 
  };
}
```

### 2. Implement Validation in Transitions

```typescript
async draft_review(scope: A_Scope): Promise<void> {
  const operation = scope.resolve(A_OperationContext)!;
  const { content, reviewerId } = operation.props;
  
  if (!content || content.trim().length === 0) {
    throw new Error('Content cannot be empty when submitting for review');
  }
  
  if (!reviewerId) {
    throw new Error('Reviewer must be assigned');
  }
  
  // Additional validation and business logic
}
```

### 3. Use Hooks for Cross-Cutting Concerns

```typescript
@A_Feature.Extend()
async [A_StateMachineFeatures.onAfterTransition](scope: A_Scope): Promise<void> {
  const operation = scope.resolve(A_OperationContext)!;
  
  // Always log transitions
  await this.auditService.logTransition({
    from: operation.props.from,
    to: operation.props.to,
    timestamp: new Date(),
    props: operation.props.props
  });
  
  // Send notifications for specific transitions
  if (operation.props.to === 'review') {
    await this.notificationService.notifyReviewer(operation.props.props.reviewerId);
  }
}
```

### 4. Handle Async Operations Properly

```typescript
async processing_completed(scope: A_Scope): Promise<void> {
  const operation = scope.resolve(A_OperationContext)!;
  const { orderId } = operation.props;
  
  try {
    // Multiple async operations
    const [invoice, notification, analytics] = await Promise.all([
      this.invoiceService.generate(orderId),
      this.notificationService.notifyCustomer(orderId),
      this.analyticsService.trackCompletion(orderId)
    ]);
    
    operation.result = {
      invoiceId: invoice.id,
      notificationSent: notification.success,
      analyticsTracked: analytics.success
    };
  } catch (error) {
    throw new Error(`Failed to complete order processing: ${error.message}`);
  }
}
```

## Examples

For complete working examples, see the `examples/A-StateMachine/` directory:

- `basic-example.ts` - Simple traffic light state machine
- `order-processing.ts` - E-commerce order workflow 
- `user-authentication.ts` - User authentication flow

## Testing

The state machine includes comprehensive test coverage. See `tests/A-StateMachine.test.ts` for examples of:

- Basic state machine creation and transitions
- Custom transition logic testing
- Lifecycle hook verification
- Error handling scenarios
- Complex workflow testing

## Related Components

- `A_Command` - For command pattern implementation
- `A_OperationContext` - Used internally for transition context
- `A_Component` - Base class that provides the feature system
- `A_Scope` - Provides dependency injection and lifecycle management