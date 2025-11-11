export enum A_StateMachineFeatures {
    /**
     * Allows to extend error handling logic and behavior
     */
    onError = 'onError',
    /**
     * Allows to extend initialization logic and behavior
     */
    onInitialize = 'onInitialize',
    /**
     * Allows to extend transition validation logic and behavior
     */
    onBeforeTransition = 'onBeforeTransition',
    /**
     * Allows to extend post-transition logic and behavior
     */
    onAfterTransition = 'onAfterTransition',
}