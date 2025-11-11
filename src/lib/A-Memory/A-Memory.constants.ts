

export enum A_MemoryFeatures {
    /**
     * Allows to extend initialization logic and behavior
     */
    onInit = 'onInit',

    /**
     * Allows to extend destruction logic and behavior
     */
    onDestroy = 'onDestroy',

    /**
     * Allows to extend expiration logic and behavior
     */
    onExpire = 'onExpire',

    /**
     * Allows to extend error handling logic and behavior
     */
    onError = 'onError',

    /**
     * Allows to extend serialization logic and behavior
     */
    onSerialize = 'onSerialize',

    /**
     * Allows to extend set operation logic and behavior
     */
    onSet = 'onSet',
    /**
     * Allows to extend get operation logic and behavior
     */
    onGet = 'onGet',
    /**
     * Allows to extend drop operation logic and behavior
     */
    onDrop = 'onDrop',
    /**
     * Allows to extend clear operation logic and behavior
     */
    onClear = 'onClear',
    /**
     * Allows to extend has operation logic and behavior
     */
    onHas = 'onHas',
}