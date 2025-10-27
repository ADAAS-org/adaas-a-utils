

// ===============================================================
// ADAAS A-Channel Constants
// ===============================================================
export enum A_ChannelFeatures {
    /**
     * Allows to extend timeout logic and behavior
     */
    onTimeout = 'onTimeout',
    /**
     * Allows to extend retry logic and behavior
     */
    onRetry = 'onRetry',
    /**
     * Allows to extend circuit breaker logic and behavior
     */
    onCircuitBreakerOpen = 'onCircuitBreakerOpen',
    /**
     * Allows to extend cache logic and behavior
     */
    onCache = 'onCache',
    /**
     * Allows to extend connection logic and behavior
     */
    onConnect = 'onConnect',
    /**
     * Allows to extend disconnection logic and behavior
     */
    onDisconnect = 'onDisconnect',
    /**
     * Allows to extend request preparation logic and behavior
     */
    onBeforeRequest = 'onBeforeRequest',
    /**
     * Allows to extend request sending logic and behavior
     */
    onRequest = 'onRequest',
    /**
     * Allows to extend request post-processing logic and behavior
     */
    onAfterRequest = 'onAfterRequest',
    /**
     * Allows to extend error handling logic and behavior
     * 
     * [!] The same approach uses for ALL errors within the channel
     */
    onError = 'onError',
    /**
     * Allows to extend send logic and behavior
     */
    onSend = 'onSend',
    /**
     * Allows to extend consume logic and behavior
     */
    onConsume = 'onConsume',
}


// ==============================================================
// A-Channel Request Constants
// ===============================================================
export enum A_ChannelRequestStatuses {
    /**
     * Request is pending
     */
    PENDING = 'PENDING',
    /***
     * Request was successful
     */
    SUCCESS = 'SUCCESS',
    /**
     * Request failed
     */
    FAILED = 'FAILED',
}