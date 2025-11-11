
/**
 * A-Command Multi-Service Processing Example
 * 
 * This example demonstrates the core concepts of A-Command:
 * 
 * 1. **Multi-Service Processing**: Commands can be executed across different services
 * 2. **Serialization**: Commands can be serialized and transmitted between services
 * 3. **Component-Based Behavior**: Different components can extend command behavior
 * 4. **Dependency Injection**: Commands use DI for accessing services and resources
 * 5. **Lifecycle Management**: Commands follow a structured execution lifecycle
 * 
 * The example shows:
 * - Service A starts command execution and delegates to Service B
 * - Service B processes the command with access to shared memory
 * - A simple channel routes commands between services
 * - Each service has its own component extending command behavior
 */

import { A_Caller, A_Component, A_Concept, A_Container, A_Error, A_Feature, A_FormatterHelper, A_Inject } from "@adaas/a-concept"
import { A_ChannelRequest } from "@adaas/a-utils/lib/A-Channel/A-ChannelRequest.context";
import { A_MemoryContext } from "@adaas/a-utils/lib/A-Memory/A-Memory.context";
import { A_OperationContext } from "@adaas/a-utils/lib/A-Operation/A-Operation.context";
import { A_StateMachine } from "@adaas/a-utils/lib/A-StateMachine/A-StateMachine.component";
import { A_Channel, A_Command, A_Command_Status, A_CommandFeatures, A_Logger, A_Memory, A_TYPES__Command_Serialized } from "src"


// ============================================================================
// ====================== Command Definition =================================
// ============================================================================

/**
 * Command parameter type definition
 * Defines the input data structure required to execute the command
 */
type myCommandParams = { userId: string };

/**
 * Command result type definition  
 * Defines the output data structure produced by successful execution
 */
type myCommandResult = { success: boolean };

/**
 * Custom Command Implementation
 * 
 * This command demonstrates:
 * - Type-safe parameter and result definitions
 * - Custom properties for storing runtime data
 * - Custom serialization extending the base toJSON method
 * - Cross-service data transmission capabilities
 */
class myCommand extends A_Command<myCommandParams, myCommandResult> {

    /** Runtime property to store user data fetched during execution */
    user?: { id: string };

    /**
     * Custom serialization method
     * 
     * Extends the base toJSON to include additional properties
     * for cross-service transmission. This allows other services
     * to receive not just the standard command data but also
     * custom fields relevant to the business logic.
     */
    toJSON(): A_TYPES__Command_Serialized<myCommandParams, myCommandResult> & { userId: string } {
        return {
            ...super.toJSON(),
            userId: this.params.userId,
        }
    }
}


// ============================================================================
// ====================== Service A Component ===============================
// ============================================================================

/**
 * Service A Command Processor
 * 
 * This component extends the command lifecycle in Service A by implementing
 * custom behavior at different execution phases. It demonstrates:
 * 
 * - Pre-execution setup (storing data in shared memory)
 * - Main execution logic (delegating to Service B via channel)
 * - Post-execution cleanup and logging
 * - Inter-service communication patterns
 */
class ServiceA_MyCommandProcessor extends A_Component {

    /**
     * Pre-execution phase handler
     * 
     * Runs before the main command execution begins.
     * Used for:
     * - Initial setup and preparation
     * - Storing data in shared memory for other services
     * - Validation and pre-processing
     * 
     * @param command - The command instance being executed
     * @param memory - Shared memory for cross-service data storage
     * @param logger - Logger instance for tracking execution
     */
    @A_Feature.Extend()
    async [A_CommandFeatures.onBeforeExecute](
        @A_Inject(A_Caller) command: myCommand,
        @A_Inject(A_Memory) memory: A_Memory<{ user: { id: string } }>,
        @A_Inject(A_Logger) logger: A_Logger,
    ) {
        logger.info('Starting command execution in Service A');

        // Store user data in shared memory for Service B to access
        await memory.set('user', { id: '555' });
    }

    /**
     * Main execution phase handler
     * 
     * Contains the core business logic for Service A.
     * In this example, it delegates processing to Service B
     * by sending the serialized command through a channel.
     * 
     * @param command - The command instance being executed
     * @param channel - Communication channel for inter-service requests
     * @param logger - Logger instance for tracking execution
     */
    @A_Feature.Extend()
    async [A_CommandFeatures.onExecute](
        @A_Inject(A_Caller) command: myCommand,
        @A_Inject(A_Channel) channel: A_Channel,
        @A_Inject(A_Logger) logger: A_Logger,
    ) {


        // Serialize command and send to Service B for processing
        const response = await channel.request<any, A_TYPES__Command_Serialized<myCommandParams, myCommandResult>>({
            container: 'ServiceB',
            command: command.toJSON()
        });

        command.fromJSON(response.data!);

    }

    /**
     * Post-execution phase handler
     * 
     * Runs after the main execution completes (success or failure).
     * Used for:
     * - Cleanup operations
     * - Final logging and metrics
     * - Notification sending
     * 
     * @param command - The command instance that was executed
     * @param logger - Logger instance for tracking execution
     */
    @A_Feature.Extend()
    async [A_CommandFeatures.onAfterExecute](
        @A_Inject(A_Caller) command: myCommand,
        @A_Inject(A_Logger) logger: A_Logger,
    ) {
        logger.info('Finishing command execution in Service A');

    }
}


// ============================================================================
// ====================== Service B Component ===============================
// ============================================================================

/**
 * Service B Command Processor
 * 
 * This component handles command processing in Service B after receiving
 * the command from Service A. It demonstrates:
 * 
 * - Accessing shared memory data from other services
 * - Processing commands with context from previous services
 * - Stateful command execution across service boundaries
 */
class ServiceB_MyCommandProcessor extends A_Component {

    /**
     * Pre-execution setup in Service B
     * 
     * Retrieves data from shared memory that was stored by Service A
     * and populates the command with additional context needed for processing.
     * 
     * This shows how commands can accumulate state and data as they
     * move through different services in a distributed system.
     * 
     * @param command - The command instance being executed
     * @param memory - Shared memory for accessing cross-service data
     * @param logger - Logger instance for tracking execution
     */
    @A_Feature.Extend()
    async [A_CommandFeatures.onBeforeExecute](
        @A_Inject(A_Caller) command: myCommand,
        @A_Inject(A_Memory) memory: A_Memory<{ user: { id: string } }>,
        @A_Inject(A_Logger) logger: A_Logger,
    ) {
        logger.info('Starting command execution in Service B');

        // Retrieve user data that was stored by Service A
        const user = await memory.get('user');

        logger.info('Retrieved user from memory:', user);

        // Populate command with additional context
        command.user = user;
        // throw new Error('Simulated error in Service B');
    }

    /**
     * Main execution logic in Service B
     * 
     * Handles the actual business logic processing for this command
     * in Service B. This is where the final processing occurs after
     * the command has been prepared by Service A.
     * 
     * @param command - The command instance being executed
     * @param logger - Logger instance for tracking execution
     */
    @A_Feature.Extend()
    async [A_CommandFeatures.onExecute](
        @A_Inject(A_Caller) command: myCommand,
        @A_Inject(A_Logger) logger: A_Logger,
    ) {
        logger.info('Executing command in Service B', command.status);

        // Perform the actual business logic processing
        // In a real scenario, this might involve:
        // - Database operations
        // - External API calls  
        // - Complex business logic calculations
        // - Result generation

        // For this example, we'll just set a success result
        // Uncomment the next line to see result handling:
        // command.result = { success: true };
        //  await  command.complete({success: true});

        throw new Error('Simulated error in Service B');

    }
}


// ============================================================================
// ====================== Inter-Service Communication ========================
// ============================================================================

/**
 * Simple Channel Implementation
 * 
 * A basic channel for routing commands between different services/containers.
 * This demonstrates:
 * 
 * - Command routing based on container names
 * - Command deserialization and reconstruction in target service
 * - Command execution in the target service context
 * - Result serialization and response handling
 * 
 * In production, this might be replaced with more sophisticated
 * message queues, HTTP APIs, or service mesh communications.
 */
class SimpleChannel extends A_Channel {

    /**
     * Handle incoming command routing requests
     * 
     * This method:
     * 1. Finds the target container by name
     * 2. Resolves the command constructor in the target scope
     * 3. Reconstructs the command from serialized data
     * 4. Executes the command in the target service
     * 5. Returns the serialized result
     * 
     * @param memory - Shared memory containing registered containers
     * @param context - Operation context with routing parameters
     * @param logger - Logger for tracking routing operations
     */
    async onRequest(
        @A_Inject(A_Memory) memory: A_Memory<{ containers: Array<A_Container> }>,
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<{ container: string, command: A_TYPES__Command_Serialized }>,
        @A_Inject(A_Logger) logger: A_Logger,
    ): Promise<void> {

        logger.info(`Channel: Routing command ${context.params.command.code} to container ${context.params.container}`);

        // Get all registered containers from shared memory
        const containers = await memory.get('containers') || [];

        // Find target container by name (supports both exact match and camelCase conversion)
        const target = containers
            .find(c => A_FormatterHelper.toCamelCase(c.name) === A_FormatterHelper.toCamelCase(context.params.container)
                || c.name === context.params.container
            )

        // Resolve the command constructor in the target container's scope
        const commandConstructor = target?.scope.resolveConstructor<A_Command>(context.params.command.code);

        if (!commandConstructor) {
            throw new A_Error(`Channel: Unable to find command constructor for ${context.params.command.code} in container ${context.params.container}`);
        }

        // Reconstruct the command from serialized data
        const command = new commandConstructor(context.params.command);

        // Register the command in the target container's scope
        target?.scope.register(command);

        // Execute the command in the target service
        await command.execute();

        // Serialize the result and send it back
        const serialized = command.toJSON();

        context.succeed(serialized);
    }
}


// ============================================================================
// ====================== Service Container Definition =======================
// ============================================================================

/**
 * Base Service Container
 * 
 * A reusable container class that automatically registers itself
 * in shared memory during the concept loading phase. This enables
 * the channel to discover and route commands to different services.
 * 
 * Each service instance:
 * - Registers itself in shared memory during startup
 * - Makes itself discoverable for command routing
 * - Provides a scope for command execution
 */
class Service extends A_Container {

    /**
     * Container initialization during concept loading
     * 
     * This method runs during the concept loading phase and ensures
     * that all service containers are registered in shared memory
     * so they can be discovered by the routing channel.
     * 
     * @param memory - Shared memory for storing container registry
     * @param logger - Logger for tracking service registration
     */
    @A_Concept.Load()
    async init(
        @A_Inject(A_Memory) memory: A_Memory<{ containers: Array<A_Container> }>,
        @A_Inject(A_Logger) logger: A_Logger,
    ) {
        logger.info(`Registering container ${this.name} in shared memory`);

        // Get existing container registry or create new one
        const containers = await memory.get('containers') || [];

        // Add this container to the registry
        containers.push(this);

        // Store updated registry in shared memory
        await memory.set('containers', containers);
    }
}

// ============================================================================
// ====================== Application Setup and Execution ===================
// ============================================================================

/**
 * Multi-Service Command Processing Demonstration
 * 
 * This example demonstrates how to set up and execute commands
 * across multiple services using the A_Concept architecture.
 * 
 * Architecture Overview:
 * - Two separate service containers (ServiceA and ServiceB)
 * - Shared memory context for inter-service communication
 * - Distributed command processing with lifecycle management
 * - State tracking and result aggregation
 */
(async () => {
    // ============================================================================
    // ====================== Shared Memory Configuration ========================
    // ============================================================================

    /**
     * Shared Memory Context
     * 
     * Creates a shared memory space that will be accessible by both services.
     * This enables inter-service communication and state sharing during
     * command execution.
     */
    const sharedMemory = new A_MemoryContext();

    // ============================================================================
    // ====================== Service Container Setup ============================
    // ============================================================================

    /**
     * Service A Container
     * 
     * Specialized service for handling the initial phases of command processing.
     * Contains its own processor, routing channel, and shared dependencies.
     * 
     * Components:
     * - ServiceA_MyCommandProcessor: Handles pre-processing and main logic
     * - SimpleChannel: Routes commands between services
     * - A_Memory: Provides access to shared state
     * - A_StateMachine: Manages command lifecycle transitions
     * - A_Logger: Provides scoped logging
     */
    const containerA = new Service({
        name: 'ServiceA',
        fragments: [sharedMemory], // Share memory context between services
        components: [
            ServiceA_MyCommandProcessor, // Service-specific command processor
            SimpleChannel,               // Inter-service communication channel
            A_Memory,                   // Memory management
            A_StateMachine,             // State machine for command lifecycle
            A_Logger                    // Scoped logging
        ],
        entities: [myCommand], // Register command entity for this service
    });

    /**
     * Service B Container
     * 
     * Specialized service for handling secondary processing and finalization.
     * Shares memory context with Service A but has its own processor logic.
     * 
     * Note: Service B doesn't include SimpleChannel as it's primarily
     * a target for routed commands rather than an initiator.
     */
    const containerB = new Service({
        name: 'ServiceB',
        fragments: [sharedMemory], // Same shared memory as Service A
        components: [
            ServiceB_MyCommandProcessor, // Service-specific command processor
            A_Memory,                   // Memory management (shared)
            A_StateMachine,             // State machine for command lifecycle
            A_Logger                    // Scoped logging
        ],
        entities: [myCommand], // Register command entity for this service
    });

    // ============================================================================
    // ====================== Concept Architecture Setup =========================
    // ============================================================================

    /**
     * A_Concept - Application Architecture
     * 
     * Defines the overall application architecture by combining:
     * - Multiple service containers
     * - Shared components available across all services
     * - Global dependency injection configuration
     * 
     * This creates a distributed system where commands can be processed
     * across multiple services while maintaining shared state and communication.
     */
    const concept = new A_Concept({
        containers: [containerA, containerB], // Register both service containers
        components: [
            SimpleChannel, // Global routing channel
            A_Memory,      // Global memory management
            A_Logger       // Global logging system
        ],
    });

    console.log('🏛️  Concept architecture defined with distributed services');

    // ============================================================================
    // ====================== System Initialization ==============================
    // ============================================================================

    /**
     * Load and Initialize the Distributed System
     * 
     * This triggers:
     * 1. Container registration in shared memory
     * 2. Component dependency resolution
     * 3. Service discovery and routing table setup
     * 4. Shared state initialization
     */
    console.log('⚡ Loading and initializing distributed system...');
    await concept.load();
    console.log('✅ System loaded - all services are ready\n');

    // ============================================================================
    // ====================== Command Creation and Execution =====================
    // ============================================================================

    /**
     * Create Command Instance
     * 
     * Instantiate the command with initial parameters.
     * The command will go through the complete lifecycle:
     * CREATED → INITIALIZED → COMPILED → EXECUTING → COMPLETED/FAILED
     */
    const command = new myCommand({ userId: '123' });
    console.log(`📝 Created command: ${command.id} for user: 123`);
    console.log(`   Initial status: ${command.status}`);

    /**
     * Register Command in Service A
     * 
     * Register the command in Service A's scope, making it available
     * for dependency injection and lifecycle management within that service.
     */
    containerA.scope.register(command);
    console.log('🔗 Command registered in ServiceA scope');

    /**
     * Execute Distributed Command
     * 
     * This will trigger:
     * 1. ServiceA_MyCommandProcessor.pre() - Pre-processing setup
     * 2. ServiceA_MyCommandProcessor.main() - Route to ServiceB
     * 3. ServiceB_MyCommandProcessor processing - Secondary processing
     * 4. ServiceA_MyCommandProcessor.post() - Result aggregation
     * 5. State transitions and result compilation
     */
    console.log('🚀 Executing distributed command across services...\n');
    await command.execute();

    // ============================================================================
    // ====================== Results and Logging ================================
    // ============================================================================

    /**
     * Result Analysis and Logging
     * 
     * After execution, analyze the command state and results.
     * The logger is resolved from the concept scope to provide
     * centralized logging across all services.
     */
    const logger = concept.scope.resolve(A_Logger)!;

    // Log final execution status
    logger.info('✨ Command execution completed');
    logger.info(`   Final status: ${command.status}`);
    logger.info('   Command state:', command.toJSON());

    console.log('\n🎉 Multi-service command processing example completed!');
    console.log('Check the logs above to see the distributed processing flow.');

})();

