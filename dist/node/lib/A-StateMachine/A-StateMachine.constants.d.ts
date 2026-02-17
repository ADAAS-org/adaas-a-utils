declare enum A_StateMachineFeatures {
    /**
     * Allows to extend error handling logic and behavior
     */
    onError = "_A_StateMachine_onError",
    /**
     * Allows to extend initialization logic and behavior
     */
    onInitialize = "_A_StateMachine_onInitialize",
    /**
     * Allows to extend transition validation logic and behavior
     */
    onBeforeTransition = "_A_StateMachine_onBeforeTransition",
    /**
     * Allows to extend post-transition logic and behavior
     */
    onAfterTransition = "_A_StateMachine_onAfterTransition"
}

export { A_StateMachineFeatures };
