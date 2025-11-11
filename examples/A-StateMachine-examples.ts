/**
 * A_StateMachine Examples
 * 
 * This file contains comprehensive examples demonstrating various use cases
 * for the A_StateMachine component including:
 * 
 * 1. Basic State Machine (Traffic Light)
 * 2. Business Workflow (Order Processing)
 * 3. User Authentication Flow
 * 4. Document Approval Workflow
 * 5. Error Handling and Recovery
 */

import { A_StateMachine } from '../src/lib/A-StateMachine/A-StateMachine.component';
import { A_StateMachineFeatures } from '../src/lib/A-StateMachine/A-StateMachine.constants';
import { A_Feature, A_Scope, A_Component, A_Context, A_Inject } from '@adaas/a-concept';
import { A_OperationContext } from '../src/lib/A-Operation/A-Operation.context';

// =============================================================================
// EXAMPLE 1: Basic Traffic Light State Machine
// =============================================================================

interface TrafficLightStates {
  red: { duration: number; timestamp: Date; };
  yellow: { duration: number; fromState: 'red' | 'green'; timestamp: Date; };
  green: { duration: number; timestamp: Date; };
}

class TrafficLightMachine extends A_StateMachine<TrafficLightStates> {
  private currentState: keyof TrafficLightStates = 'red';

  @A_Feature.Extend()
  async [A_StateMachineFeatures.onInitialize](): Promise<void> {
    console.log('🚦 Traffic Light System Initialized');
  }

  @A_Feature.Extend()
  async [A_StateMachineFeatures.onBeforeTransition](
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const { from, to } = operation.params;
    console.log(`🔄 Light changing: ${String(from).toUpperCase()} → ${String(to).toUpperCase()}`);
  }

  // Custom transition with validation
  @A_Feature.Extend()
  async red_green(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const { duration } = operation.params.props;

    if (duration < 30000) {
      throw new Error('Green light must be at least 30 seconds for safety');
    }

    console.log('🟢 GREEN: Traffic may proceed');
    operation.succeed({ safetyChecked: true });
  }

  getCurrentState(): keyof TrafficLightStates {
    return this.currentState;
  }
}

// =============================================================================
// EXAMPLE 2: E-commerce Order Processing Workflow
// =============================================================================

interface OrderStates {
  pending: { orderId: string; customerId: string; amount: number; };
  validated: { orderId: string; customerId: string; amount: number; validatedAt: Date; };
  paid: { orderId: string; customerId: string; amount: number; transactionId: string; };
  shipped: { orderId: string; customerId: string; amount: number; trackingId: string; };
  delivered: { orderId: string; customerId: string; amount: number; deliveredAt: Date; };
  cancelled: { orderId: string; customerId: string; amount: number; reason: string; };
}

class OrderProcessingMachine extends A_StateMachine<OrderStates> {
  private currentState: keyof OrderStates = 'pending';

  @A_Feature.Extend()
  async [A_StateMachineFeatures.onAfterTransition](
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {

    this.currentState = operation.params.to as keyof OrderStates;
    console.log(`📦 Order now in ${String(this.currentState).toUpperCase()} state`);
  }


  @A_Feature.Extend()
  async pending_validated(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const orderData = operation.params.props;

    console.log('🔍 Validating order...');
    // Simulate inventory check
    await new Promise(resolve => setTimeout(resolve, 500));

    operation.succeed({
      ...orderData,
      validatedAt: new Date()
    });
  }


  @A_Feature.Extend()
  async validated_paid(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const orderData = operation.params.props;

    console.log('💳 Processing payment...');
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    operation.succeed({
      ...orderData,
      transactionId: `txn_${Date.now()}`
    });
  }

  @A_Feature.Extend()
  async paid_shipped(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const orderData = operation.params.props;

    console.log('📮 Creating shipment...');
    await new Promise(resolve => setTimeout(resolve, 300));

    operation.succeed({
      ...orderData,
      trackingId: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
  }

  getCurrentState(): keyof OrderStates {
    return this.currentState;
  }
}

// =============================================================================
// EXAMPLE 3: User Authentication Flow
// =============================================================================

interface AuthStates {
  anonymous: { sessionId: string; };
  authenticating: { sessionId: string; username: string; };
  authenticated: { sessionId: string; userId: string; username: string; loginTime: Date; };
  mfa_required: { sessionId: string; userId: string; username: string; mfaChallenge: string; };
  mfa_verified: { sessionId: string; userId: string; username: string; loginTime: Date; mfaVerified: boolean; };
  locked: { sessionId: string; reason: string; lockedAt: Date; };
  logged_out: { sessionId: string; logoutTime: Date; };
}

class AuthenticationMachine extends A_StateMachine<AuthStates> {
  private attempts = 0;
  private maxAttempts = 3;

  @A_Feature.Extend()
  async [A_StateMachineFeatures.onError](): Promise<void> {
    this.attempts++;
    console.log(`❌ Authentication attempt ${this.attempts}/${this.maxAttempts} failed`);

    if (this.attempts >= this.maxAttempts) {
      console.log('🔒 Account will be locked due to too many failed attempts');
    }
  }

  @A_Feature.Extend()
  async anonymous_authenticating(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const { username } = operation.params.props;

    console.log(`🔐 Starting authentication for user: ${username}`);

    operation.succeed({
      sessionId: operation.params.props.sessionId,
      username
    });
  }

  @A_Feature.Extend()
  async authenticating_authenticated(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const { sessionId, username } = operation.params.props;

    console.log('✅ Basic authentication successful');
    // Reset attempts on successful auth
    this.attempts = 0;

    operation.succeed({
      sessionId,
      userId: `user_${Date.now()}`,
      username,
      loginTime: new Date()
    });
  }

  @A_Feature.Extend()
  async authenticated_mfa_required(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const authData = operation.params.props;

    console.log('🔢 Multi-factor authentication required');

    operation.succeed({
      ...authData,
      mfaChallenge: `MFA_${Math.random().toString(36).substr(2, 8)}`
    });
  }

  @A_Feature.Extend()
  async mfa_required_mfa_verified(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const authData = operation.params.props;

    console.log('🔐 MFA verification successful');

    operation.succeed({
      ...authData,
      loginTime: new Date(),
      mfaVerified: true
    });
  }

  @A_Feature.Extend()
  async authenticating_locked(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    console.log('🔒 Account locked due to failed attempts');

    operation.succeed({
      sessionId: operation.params.props.sessionId,
      reason: 'Too many failed login attempts',
      lockedAt: new Date()
    });
  }
}

// =============================================================================
// EXAMPLE 4: Document Approval Workflow
// =============================================================================

interface DocumentStates {
  draft: { docId: string; authorId: string; content: string; };
  review: { docId: string; authorId: string; content: string; reviewerId: string; reviewStarted: Date; };
  approved: { docId: string; authorId: string; content: string; approvedBy: string; approvedAt: Date; };
  rejected: { docId: string; authorId: string; content: string; rejectedBy: string; rejectedAt: Date; feedback: string; };
  published: { docId: string; authorId: string; content: string; publishedAt: Date; version: number; };
  archived: { docId: string; authorId: string; content: string; archivedAt: Date; reason: string; };
}

class DocumentWorkflowMachine extends A_StateMachine<DocumentStates> {

  @A_Feature.Extend()
  async [A_StateMachineFeatures.onBeforeTransition](
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const { from, to, props } = operation.params;

    // Business rule validation
    if (to === 'published' && from !== 'approved') {
      throw new Error('Documents can only be published after approval');
    }

    if (to === 'review' && (!props?.content || props.content.trim().length < 10)) {
      throw new Error('Document must have at least 10 characters to submit for review');
    }

    console.log(`📄 Document ${props?.docId}: ${String(from)} → ${String(to)}`);
  }

  @A_Feature.Extend()
  async draft_review(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const docData = operation.params.props;

    console.log('📋 Submitting document for review...');

    // Auto-assign reviewer (in real app, would be based on business logic)
    const reviewerId = this.assignReviewer(docData.authorId);

    operation.succeed({
      ...docData,
      reviewerId,
      reviewStarted: new Date()
    });
  }

  @A_Feature.Extend()
  async review_approved(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const docData = operation.params.props;

    console.log('✅ Document approved');

    operation.succeed({
      docId: docData.docId,
      authorId: docData.authorId,
      content: docData.content,
      approvedBy: docData.reviewerId,
      approvedAt: new Date()
    });
  }

  @A_Feature.Extend()
  async review_rejected(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const docData = operation.params.props;

    console.log('❌ Document rejected');

    operation.succeed({
      docId: docData.docId,
      authorId: docData.authorId,
      content: docData.content,
      rejectedBy: docData.reviewerId,
      rejectedAt: new Date(),
      feedback: 'Please revise and resubmit'
    });
  }

  @A_Feature.Extend()
  async approved_published(
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const docData = operation.params.props;

    console.log('🚀 Publishing document...');

    operation.succeed({
      docId: docData.docId,
      authorId: docData.authorId,
      content: docData.content,
      publishedAt: new Date(),
      version: 1
    });
  }

  private assignReviewer(authorId: string): string {
    const reviewers = ['reviewer1', 'reviewer2', 'reviewer3'];
    return reviewers[authorId.length % reviewers.length];
  }
}

// =============================================================================
// EXAMPLE 5: External Component for Cross-Cutting Concerns
// =============================================================================

class StateMachineLogger extends A_Component {


  @A_Feature.Extend({ scope: [TrafficLightMachine, OrderProcessingMachine, AuthenticationMachine, DocumentWorkflowMachine] })
  async [A_StateMachineFeatures.onAfterTransition](
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const { from, to, props } = operation.params;

    // Log all state transitions for audit purposes
    const logEntry = {
      timestamp: new Date().toISOString(),
      transition: `${String(from)} → ${String(to)}`,
      entityId: props?.orderId || props?.docId || props?.sessionId || 'unknown',
      success: true
    };

    console.log(`📊 [AUDIT LOG] ${JSON.stringify(logEntry)}`);
  }

  @A_Feature.Extend({ scope: [TrafficLightMachine, OrderProcessingMachine, AuthenticationMachine, DocumentWorkflowMachine] })
  async [A_StateMachineFeatures.onError](
    @A_Inject(A_OperationContext) operation: A_OperationContext
  ): Promise<void> {
    const { from, to, props } = operation.params;

    const errorLog = {
      timestamp: new Date().toISOString(),
      transition: `${String(from)} → ${String(to)}`,
      entityId: props?.orderId || props?.docId || props?.sessionId || 'unknown',
      success: false,
      error: 'Transition failed'
    };

    console.log(`📊 [ERROR LOG] ${JSON.stringify(errorLog)}`);
  }
}

// =============================================================================
// EXAMPLE RUNNER FUNCTIONS
// =============================================================================

async function runTrafficLightExample(): Promise<void> {
  console.log('🚦 === Traffic Light Example ===\n');

  const trafficLight = new TrafficLightMachine();
  await trafficLight.ready;

  try {
    await trafficLight.transition('red', 'green', {
      duration: 30000,
      timestamp: new Date()
    });

    await trafficLight.transition('green', 'yellow', {
      duration: 5000,
      fromState: 'green',
      timestamp: new Date()
    });

    await trafficLight.transition('yellow', 'red', {
      duration: 60000,
      timestamp: new Date()
    });

    console.log(`✅ Traffic light cycle completed. Current state: ${trafficLight.getCurrentState()}\n`);

  } catch (error) {
    console.error('❌ Traffic light error:', (error as Error).message);
  }
}

async function runOrderProcessingExample(): Promise<void> {
  console.log('📦 === Order Processing Example ===\n');

  const orderMachine = new OrderProcessingMachine();
  await orderMachine.ready;

  const orderData = {
    orderId: 'ORD-001',
    customerId: 'CUST-123',
    amount: 99.99
  };

  try {
    await orderMachine.transition('pending', 'validated', orderData);
    await orderMachine.transition('validated', 'paid', {
      ...orderData,
      validatedAt: new Date()
    });
    await orderMachine.transition('paid', 'shipped', {
      ...orderData,
      transactionId: 'txn_123'
    });

    console.log(`✅ Order processed successfully. Final state: ${orderMachine.getCurrentState()}\n`);

  } catch (error) {
    console.error('❌ Order processing error:', (error as Error).message);
  }
}

async function runAuthenticationExample(): Promise<void> {
  console.log('🔐 === Authentication Flow Example ===\n');

  const authMachine = new AuthenticationMachine();
  await authMachine.ready;

  const sessionData = {
    sessionId: 'sess_' + Date.now()
  };

  try {
    // Successful authentication flow
    await authMachine.transition('anonymous', 'authenticating', {
      ...sessionData,
      username: 'john.doe'
    });

    await authMachine.transition('authenticating', 'authenticated', {
      ...sessionData,
      username: 'john.doe'
    });

    await authMachine.transition('authenticated', 'mfa_required', {
      sessionId: sessionData.sessionId,
      userId: 'user_123',
      username: 'john.doe',
      loginTime: new Date()
    });

    await authMachine.transition('mfa_required', 'mfa_verified', {
      sessionId: sessionData.sessionId,
      userId: 'user_123',
      username: 'john.doe',
      mfaChallenge: 'MFA_12345'
    });

    console.log('✅ Authentication flow completed with MFA\n');

  } catch (error) {
    console.error('❌ Authentication error:', (error as Error).message);
  }
}

async function runDocumentWorkflowExample(): Promise<void> {
  console.log('📄 === Document Workflow Example ===\n');

  const docMachine = new DocumentWorkflowMachine();
  await docMachine.ready;

  const docData = {
    docId: 'DOC-001',
    authorId: 'author1',
    content: 'This is a comprehensive document that needs review and approval before publication.'
  };

  try {
    await docMachine.transition('draft', 'review', docData);

    await docMachine.transition('review', 'approved', {
      ...docData,
      reviewerId: 'reviewer1',
      reviewStarted: new Date()
    });

    await docMachine.transition('approved', 'published', {
      docId: docData.docId,
      authorId: docData.authorId,
      content: docData.content,
      approvedBy: 'reviewer1',
      approvedAt: new Date()
    });

    console.log('✅ Document successfully published\n');

  } catch (error) {
    console.error('❌ Document workflow error:', (error as Error).message);
  }
}

async function runErrorHandlingExample(): Promise<void> {
  console.log('⚠️ === Error Handling Example ===\n');

  const docMachine = new DocumentWorkflowMachine();
  await docMachine.ready;

  try {
    // Try to submit document with insufficient content
    await docMachine.transition('draft', 'review', {
      docId: 'DOC-002',
      authorId: 'author2',
      content: 'Too short' // This will fail validation
    });
  } catch (error) {
    console.log('❌ Expected validation error:', (error as Error).message);
  }

  try {
    // Try invalid transition
    await docMachine.transition('draft', 'published', {
      docId: 'DOC-003',
      authorId: 'author3',
      content: 'Cannot publish directly from draft'
    });
  } catch (error) {
    console.log('❌ Expected business rule error:', (error as Error).message);
  }

  console.log('✅ Error handling examples completed\n');
}

// =============================================================================
// MAIN EXAMPLE RUNNER
// =============================================================================

async function runAllExamples(): Promise<void> {
  console.log('🎯 === A_StateMachine Comprehensive Examples ===\n');

  // Register the logger component for cross-cutting concerns
  A_Context.root.register(StateMachineLogger);

  await runTrafficLightExample();
  await runOrderProcessingExample();
  await runAuthenticationExample();
  await runDocumentWorkflowExample();
  await runErrorHandlingExample();

  console.log('🎉 All examples completed successfully!');
}

// Export everything for use in tests or other modules
export {
  TrafficLightMachine,
  OrderProcessingMachine,
  AuthenticationMachine,
  DocumentWorkflowMachine,
  StateMachineLogger,
  runAllExamples,
  runTrafficLightExample,
  runOrderProcessingExample,
  runAuthenticationExample,
  runDocumentWorkflowExample,
  runErrorHandlingExample
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}