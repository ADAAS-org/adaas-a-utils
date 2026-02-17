declare enum A_MemoryFeatures {
    /**
     * Allows to extend initialization logic and behavior
     */
    onInit = "_A_Memory_onInit",
    /**
     * Allows to extend destruction logic and behavior
     */
    onDestroy = "_A_Memory_onDestroy",
    /**
     * Allows to extend expiration logic and behavior
     */
    onExpire = "_A_Memory_onExpire",
    /**
     * Allows to extend error handling logic and behavior
     */
    onError = "_A_Memory_onError",
    /**
     * Allows to extend serialization logic and behavior
     */
    onSerialize = "_A_Memory_onSerialize",
    /**
     * Allows to extend set operation logic and behavior
     */
    onSet = "_A_Memory_onSet",
    /**
     * Allows to extend get operation logic and behavior
     */
    onGet = "_A_Memory_onGet",
    /**
     * Allows to extend drop operation logic and behavior
     */
    onDrop = "_A_Memory_onDrop",
    /**
     * Allows to extend clear operation logic and behavior
     */
    onClear = "_A_Memory_onClear",
    /**
     * Allows to extend has operation logic and behavior
     */
    onHas = "_A_Memory_onHas"
}

export { A_MemoryFeatures };
