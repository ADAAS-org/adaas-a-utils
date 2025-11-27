

// ===============================================================
// ADAAS A-Channel Constants
// ===============================================================
export enum A_ChannelFeatures {
    /**
     * Allows to extend timeout logic and behavior
     */
    onTimeout = '_A_Channel_onTimeout',
    /**
     * Allows to extend retry logic and behavior
     */
    onRetry = '_A_Channel_onRetry',
    /**
     * Allows to extend circuit breaker logic and behavior
     */
    onCircuitBreakerOpen = '_A_Channel_onCircuitBreakerOpen',
    /**
     * Allows to extend cache logic and behavior
     */
    onCache = '_A_Channel_onCache',
    /**
     * Allows to extend connection logic and behavior
     */
    onConnect = '_A_Channel_onConnect',
    /**
     * Allows to extend disconnection logic and behavior
     */
    onDisconnect = '_A_Channel_onDisconnect',
    /**
     * Allows to extend request preparation logic and behavior
     */
    onBeforeRequest = '_A_Channel_onBeforeRequest',
    /**
     * Allows to extend request sending logic and behavior
     */
    onRequest = '_A_Channel_onRequest',
    /**
     * Allows to extend request post-processing logic and behavior
     */
    onAfterRequest = '_A_Channel_onAfterRequest',
    /**
     * Allows to extend error handling logic and behavior
     * 
     * [!] The same approach uses for ALL errors within the channel
     */
    onError = '_A_Channel_onError',
    /**
     * Allows to extend send logic and behavior
     */
    onSend = '_A_Channel_onSend',
    /**
     * Allows to extend consume logic and behavior
     */
    onConsume = '_A_Channel_onConsume',
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