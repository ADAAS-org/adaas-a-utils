// ============================================================================
// ====================== A-Command Feature-Driven Example ==================
// ============================================================================

/**
 * Advanced Command Processing with Feature Templates
 * 
 * This example demonstrates how to use A_Command with feature-driven architecture
 * where command execution is configured through templates that map specific
 * result properties to component handlers.
 * 
 * Key Concepts Demonstrated:
 * - Feature-driven command definition with @A_Feature.Define()
 * - Template-based execution mapping components to result properties
 * - Component-based handler system for modular processing
 * - Automated command lifecycle with result compilation
 * - Container-based command execution with scope management
 */

import { A_Component, A_Concept, A_Container, A_Feature, A_Inject } from "@adaas/a-concept";
import { A_StateMachine } from "@adaas/a-utils/lib/A-StateMachine/A-StateMachine.component";
import { A_Command, A_CommandFeatures, A_Logger, A_Memory } from "src";

// ============================================================================
// ====================== Command Type Definitions ===========================
// ============================================================================

/**
 * Command Input Parameters
 * 
 * Defines the shape of data required to execute the CustomCommand.
 * In this example, we need an item identifier to process.
 */
type CustomCommandParams = { itemId: string };

/**
 * Command Result Structure
 * 
 * Defines the expected output structure of the command execution.
 * The feature template will map these properties to specific component handlers.
 */
type CustomCommandResult = { itemName: string; itemPrice: number };


// ============================================================================
// ====================== Feature-Driven Command Definition =================
// ============================================================================

/**
 * CustomCommand - Feature-Template Based Command
 * 
 * This command demonstrates advanced feature-driven architecture where:
 * 
 * 1. TEMPLATE MAPPING: Each result property is mapped to a specific component and handler
 * 2. AUTOMATED EXECUTION: The framework automatically calls the mapped handlers
 * 3. RESULT COMPILATION: Handler outputs are automatically compiled into the result object
 * 4. MODULAR PROCESSING: Each aspect of the command is handled by specialized components
 * 
 * Architecture Flow:
 * 1. Command is executed via [A_CommandFeatures.onExecute]
 * 2. Framework processes the feature template
 * 3. For each template entry, the specified component handler is called
 * 4. Handler results are mapped back to the corresponding result properties
 * 5. Final result object is compiled with all property values
 * 
 * Template Configuration:
 * - itemName → ComponentA.log1() : Handles item name resolution
 * - itemPrice → ComponentB.log2() : Handles item price calculation
 */
class CustomCommand extends A_Command<CustomCommandParams, CustomCommandResult> {

    /**
     * Feature Template Definition
     * 
     * The @A_Feature.Define decorator configures how command execution
     * is mapped to component handlers. Each template entry defines:
     * 
     * @param name - The result property name that will receive the handler output
     * @param component - The component class name that contains the handler
     * @param handler - The method name within the component to execute
     * 
     * Execution Flow:
     * 1. Framework resolves ComponentA from scope
     * 2. Calls ComponentA.log1() → result mapped to result.itemName
     * 3. Framework resolves ComponentB from scope  
     * 4. Calls ComponentB.log2() → result mapped to result.itemPrice
     * 5. Final result object: { itemName: ..., itemPrice: ... }
     */
    @A_Feature.Define({
        template: [
            {
                name: 'itemName',        // Maps handler result to result.itemName
                component: 'ComponentA', // Resolve ComponentA from scope
                handler: 'log1'          // Call ComponentA.log1() method
            },
            {
                name: 'itemPrice',       // Maps handler result to result.itemPrice
                component: 'ComponentB', // Resolve ComponentB from scope
                handler: 'log2'          // Call ComponentB.log2() method
            }
        ]
    })
    /**
     * Command Execution Entry Point
     * 
     * This method is called when command.execute() is invoked.
     * The feature template processing happens automatically
     * after this method completes.
     * 
     * Execution Order:
     * 1. This onExecute method runs first
     * 2. Feature template processing executes component handlers
     * 3. Results are compiled into the command result
     * 4. Command status transitions to COMPLETED
     */
    protected async [A_CommandFeatures.onExecute](
        @A_Inject(A_Logger) logger: A_Logger
    ): Promise<void> {
        logger.info("🚀 Executing CustomCommand with params:", this.params);
        logger.info("   ItemId to process:", this.params.itemId);
        logger.info("   Template will now process component handlers...");
    }
}


// ============================================================================
// ====================== Specialized Component Handlers ====================
// ============================================================================

/**
 * ComponentA - Item Name Resolution Handler
 * 
 * Specialized component responsible for resolving item names.
 * In a real-world scenario, this might:
 * - Query a database for item details
 * - Call an external API for product information
 * - Apply business logic for name formatting
 * - Cache results for performance optimization
 * 
 * The log1() method will be automatically called by the command
 * feature template and its result will be mapped to result.itemName.
 */
class ComponentA extends A_Component {

    /**
     * Item Name Resolution Handler
     * 
     * This method is called automatically by the CustomCommand feature template.
     * The return value (if any) will be mapped to the 'itemName' property
     * in the command result.
     * 
     * @returns The resolved item name (currently just logging, but could return actual data)
     */
    log1(
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        logger.info("📦 ComponentA.log1() - Processing item name resolution");
        logger.info("   Simulating item name lookup...");

        // In a real implementation, this might return:
        // return await this.itemService.getItemName(itemId);
        
        // For demo purposes, we'll just log the action
        logger.info("   ✅ Item name resolved");
    }

}

/**
 * ComponentB - Item Price Calculation Handler
 * 
 * Specialized component responsible for calculating item prices.
 * In a real-world scenario, this might:
 * - Apply pricing rules and discounts
 * - Calculate taxes and fees
 * - Handle currency conversion
 * - Integrate with pricing engines
 * 
 * The log2() method will be automatically called by the command
 * feature template and its result will be mapped to result.itemPrice.
 */
class ComponentB extends A_Component {

    /**
     * Item Price Calculation Handler
     * 
     * This method is called automatically by the CustomCommand feature template.
     * The return value (if any) will be mapped to the 'itemPrice' property
     * in the command result.
     * 
     * @returns The calculated item price (currently just logging, but could return actual data)
     */
    log2(
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        logger.info("💰 ComponentB.log2() - Processing item price calculation");
        logger.info("   Simulating price calculation logic...");

        // In a real implementation, this might return:
        // return await this.priceEngine.calculatePrice(itemId, context);
        
        // For demo purposes, we'll just log the action
        logger.info("   ✅ Item price calculated");
    }
}


// ============================================================================
// ====================== Command Processing Container =======================
// ============================================================================

/**
 * CommandProcessor - Execution Environment Container
 * 
 * This container provides the execution environment for feature-driven commands.
 * It acts as the orchestrator that:
 * 
 * 1. SCOPE MANAGEMENT: Provides dependency injection scope for commands and components
 * 2. COMMAND LIFECYCLE: Manages command creation, registration, and execution
 * 3. RESULT HANDLING: Processes and logs command execution results
 * 4. COMPONENT RESOLUTION: Ensures all required components are available for feature templates
 * 
 * The @A_Concept.Start() decorator ensures this processing logic runs
 * automatically when the concept starts up.
 */
class CommandProcessor extends A_Container {

    /**
     * Container Startup and Command Execution
     * 
     * This method demonstrates the complete lifecycle of feature-driven command execution:
     * 
     * 1. COMMAND CREATION: Instantiate command with specific parameters
     * 2. SCOPE REGISTRATION: Register command in container scope for DI
     * 3. FEATURE EXECUTION: Execute command with automatic template processing
     * 4. RESULT ANALYSIS: Examine and log the final command state and results
     * 
     * Execution Flow:
     * 1. CustomCommand created with itemId: '999'
     * 2. Command registered in container scope
     * 3. command.execute() triggers:
     *    - CustomCommand[A_CommandFeatures.onExecute]() runs
     *    - Feature template processes component handlers
     *    - ComponentA.log1() called → mapped to result.itemName
     *    - ComponentB.log2() called → mapped to result.itemPrice
     *    - Final result compiled and command status updated
     * 4. Final state logged with complete command information
     */
    @A_Concept.Start()
    protected async start(
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        logger.info('🎬 CommandProcessor starting - initializing feature-driven command execution');

        // ====================================================================
        // ====================== Command Creation ==========================
        // ====================================================================
        
        /**
         * Create Feature-Driven Command Instance
         * 
         * Instantiate the CustomCommand with specific parameters.
         * The itemId will be available throughout the command execution
         * and can be used by component handlers for processing.
         */
        const command = new CustomCommand({ itemId: '999' });
        logger.info(`📝 Created CustomCommand: ${command.id}`);
        logger.info(`   Parameters: itemId = ${command.params.itemId}`);
        logger.info(`   Initial status: ${command.status}`);

        // ====================================================================
        // ====================== Scope Registration ========================
        // ====================================================================
        
        /**
         * Register Command in Container Scope
         * 
         * This makes the command available for dependency injection
         * and ensures it can interact with other components in the container.
         */
        this.scope.register(command);
        logger.info('🔗 Command registered in CommandProcessor scope');

        // ====================================================================
        // ====================== Feature-Driven Execution ==================
        // ====================================================================
        
        /**
         * Execute Command with Feature Template Processing
         * 
         * This triggers the complete command execution pipeline:
         * 1. Command onExecute method runs
         * 2. Feature template is processed
         * 3. Component handlers are called automatically
         * 4. Results are compiled into the command result object
         * 5. Command status transitions to COMPLETED
         */
        logger.info('⚡ Executing feature-driven command...');
        await command.execute();
        logger.info('✅ Command execution completed');

        // ====================================================================
        // ====================== Result Analysis ===========================
        // ====================================================================
        
        /**
         * Analyze Command Execution Results
         * 
         * After execution, the command contains:
         * - Updated status (should be COMPLETED)
         * - Compiled result object with mapped component handler outputs
         * - Complete execution history and state information
         */
        logger.info('📊 Command Execution Analysis:');
        logger.info(`   Final status: ${command.status}`);
        logger.info('   Complete command state:', command.toJSON());
        logger.info('🎉 Feature-driven command processing demonstration completed!');
    }
}



// ============================================================================
// ====================== Application Architecture Setup =====================
// ============================================================================

/**
 * Feature-Driven Command Processing Application
 * 
 * This application demonstrates a complete feature-driven command architecture
 * where commands are executed through configurable templates that map
 * result properties to specialized component handlers.
 * 
 * Architecture Components:
 * - A_Concept: Main application architecture container
 * - CommandProcessor: Execution environment for feature-driven commands
 * - CustomCommand: Feature-template configured command implementation
 * - ComponentA/B: Specialized handlers for different result properties
 * 
 * Execution Flow:
 * 1. Concept loads all containers and dependencies
 * 2. CommandProcessor starts and creates command instances
 * 3. Commands execute with automatic feature template processing
 * 4. Component handlers are called and results are compiled
 * 5. Final results are logged and analyzed
 */
(async () => {
    console.log('🚀 Starting Feature-Driven Command Processing Application');

    // ========================================================================
    // ====================== Concept Architecture Definition ================
    // ========================================================================
    
    /**
     * Application Architecture Configuration
     * 
     * Defines the complete application architecture with:
     * - CommandProcessor container for command execution environment
     * - All required components for feature template processing
     * - Dependency injection configuration for seamless component resolution
     * 
     * Container Components:
     * - A_Logger: Provides scoped logging throughout the application
     * - CustomCommand: The feature-driven command implementation
     * - ComponentA: Handler for itemName resolution
     * - ComponentB: Handler for itemPrice calculation
     * - A_Memory: Memory management for state persistence
     */
    const concept = new A_Concept({
        containers: [
            new CommandProcessor({
                name: 'Command Executor',
                components: [
                    A_Logger,      // Scoped logging system
                    CustomCommand, // Feature-driven command class
                    ComponentA,    // Item name resolution handler
                    ComponentB,    // Item price calculation handler
                    A_Memory,      // Memory management system
                ],
            })
        ],
        components: [
            A_Logger,  // Global logger for the concept
            A_Memory   // Global memory management
        ],
    });

    const logger = concept.scope.resolve(A_Logger)!;

    logger.info('🏗️  Application architecture configured');
    logger.info('   - CommandProcessor container with feature-driven components');
    logger.info('   - Component handlers for modular command processing');
    logger.info('   - Integrated logging and memory management');

    // ========================================================================
    // ====================== System Initialization ==========================
    // ========================================================================
    
    /**
     * Load Application Architecture
     * 
     * Initialize all containers, resolve dependencies, and prepare
     * the system for command execution. This ensures all components
     * are properly registered and available for feature template processing.
     */
    logger.info('⚡ Loading application architecture...');
    await concept.load();
    logger.info('✅ Architecture loaded - all components ready');

    // ========================================================================
    // ====================== Application Execution ===========================
    // ========================================================================
    
    /**
     * Start Command Processing
     * 
     * Trigger the CommandProcessor @A_Concept.Start() method which will:
     * 1. Create CustomCommand instances
     * 2. Execute feature-driven command processing
     * 3. Demonstrate template-based component handler execution
     * 4. Log complete results and analysis
     */
    logger.info('🎬 Starting command processing demonstration...');
    await concept.start();

    logger.info('🏁 Application execution completed successfully!');
    logger.info('Review the logs above to see the feature-driven command processing flow.');

})();