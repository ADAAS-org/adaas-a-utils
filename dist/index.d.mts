import { A_Component, A_Error, A_TYPES__Error_Serialized, A_TYPES__Entity_Serialized, A_Meta, A_TYPES__FeatureExtendDecoratorMeta, A_TYPES__FeatureDefineDecoratorMeta, A_Entity, A_Scope, A_TYPES__ConceptENVVariables, A_TYPES__Fragment_Constructor, A_Fragment, A_Container, A_Feature, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor } from '@adaas/a-concept';
import { A_TYPES__Container_Constructor } from '@adaas/a-concept/dist/src/global/A-Container/A-Container.types';

declare class A_Channel extends A_Component {
    /**
     * Indicates whether the channel is processing requests
     */
    protected _processing: boolean;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;
    /**
      * Indicates whether the channel is processing requests
      */
    get processing(): boolean;
    /**
     * Indicates whether the channel is connected
     */
    get initialize(): Promise<void>;
    connect(): Promise<void>;
    request(params: any): Promise<any>;
    send(message: any): Promise<void>;
}

declare class A_ChannelError extends A_Error {
    static readonly MethodNotImplemented = "A-Channel Method Not Implemented";
}

declare enum A_TYPES__CommandMetaKey {
    EXTENSIONS = "a-command-extensions",
    FEATURES = "a-command-features",
    ABSTRACTIONS = "a-command-abstractions"
}
declare enum A_CONSTANTS__A_Command_Status {
    CREATED = "CREATED",
    INITIALIZATION = "INITIALIZATION",
    INITIALIZED = "INITIALIZED",
    COMPILATION = "COMPILATION",
    COMPILED = "COMPILED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
/**
 * A-Command Lifecycle Features
 */
declare enum A_CONSTANTS_A_Command_Features {
    INIT = "init",
    COMPLIED = "complied",
    EXECUTE = "execute",
    COMPLETE = "complete",
    FAIL = "fail"
}
type A_CONSTANTS__A_Command_Event = 'init' | 'compile' | 'execute' | 'complete' | 'fail';

/**
 * Command constructor type
 * Uses the generic type T to specify the type of the entity
 */
type A_TYPES__Command_Constructor<T = A_Command> = new (...args: any[]) => T;
/**
 * Command initialization type
 */
type A_TYPES__Command_Init = Record<string, any>;
/**
 * Command serialized type
 */
type A_TYPES__Command_Serialized<ParamsType extends Record<string, any> = Record<string, any>, ResultType extends Record<string, any> = Record<string, any>> = {
    /**
     * Unique code of the command
     */
    code: string;
    /**
     * Current status of the command
     */
    status: A_CONSTANTS__A_Command_Status;
    /**
     * Parameters used to invoke the command
     */
    params: ParamsType;
    /**
     * The time when the command was created
     */
    startedAt?: string;
    /**
     * The time when the command execution ended
     */
    endedAt?: string;
    /**
     * Duration of the command execution in milliseconds
     */
    duration?: number;
    /**
     * Result of the command execution
     */
    result?: ResultType;
    /**
     * List of errors occurred during the command execution
     */
    errors?: Array<A_TYPES__Error_Serialized>;
} & A_TYPES__Entity_Serialized;
/**
 * Command listener type
 */
type A_TYPES__Command_Listener<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string = A_CONSTANTS__A_Command_Event> = (command?: A_Command<InvokeType, ResultType, LifecycleEvents>) => void;
/**
 * Command meta type
 */
type A_TYPES__CommandMeta = {
    [A_TYPES__CommandMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[];
    }>;
    case: any;
    [A_TYPES__CommandMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta;
    }>;
};

declare class A_Command<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string | A_CONSTANTS__A_Command_Event = A_CONSTANTS__A_Command_Event> extends A_Entity<InvokeType, A_TYPES__Command_Serialized<InvokeType, ResultType>> {
    /**
     * Command Identifier that corresponds to the class name
     */
    static get code(): string;
    protected _result?: ResultType;
    protected _executionScope: A_Scope;
    protected _errors?: Set<A_Error>;
    protected _params: InvokeType;
    protected _status: A_CONSTANTS__A_Command_Status;
    protected _listeners: Map<LifecycleEvents | A_CONSTANTS__A_Command_Event, Set<A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>>>;
    protected _startTime?: Date;
    protected _endTime?: Date;
    /**
     * Execution Duration in milliseconds
     */
    get duration(): number | undefined;
    /**
     * A shared scope between all features of the command during its execution
     */
    get scope(): A_Scope;
    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     *
     */
    get code(): string;
    /**
     * Current status of the command
     */
    get status(): A_CONSTANTS__A_Command_Status;
    /**
     * Start time of the command execution
     */
    get startedAt(): Date | undefined;
    /**
     * End time of the command execution
     */
    get endedAt(): Date | undefined;
    /**
     * Result of the command execution stored in the context
     */
    get result(): ResultType | undefined;
    /**
     * Errors encountered during the command execution stored in the context
     */
    get errors(): Set<A_Error> | undefined;
    /**
     * Parameters used to invoke the command
     */
    get params(): InvokeType;
    /**
     * Indicates if the command has failed
     */
    get isFailed(): boolean;
    /**
     * Indicates if the command has completed successfully
     */
    get isCompleted(): boolean;
    /**
     *
     * A-Command represents an executable command with a specific code and parameters.
     * It can be executed within a given scope and stores execution results and errors.
     *
     *
     * A-Command should be context independent and execution logic should be based on attached components
     *
     * @param code
     * @param params
     */
    constructor(
    /**
     * Command invocation parameters
     */
    params: InvokeType | A_TYPES__Command_Serialized<InvokeType, ResultType> | string);
    init(): Promise<void>;
    compile(): Promise<void>;
    /**
     * Processes the command execution
     *
     * @returns
     */
    process(): Promise<void>;
    /**
     * Executes the command logic.
     */
    execute(): Promise<any>;
    /**
     * Marks the command as completed
     */
    complete(): Promise<void>;
    /**
     * Marks the command as failed
     */
    fail(): Promise<void>;
    /**
     * Registers an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    on(event: LifecycleEvents | A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event: LifecycleEvents | A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event: LifecycleEvents | A_CONSTANTS__A_Command_Event): void;
    /**
     * Allows to create a Command instance from new data
     *
     * @param newEntity
     */
    fromNew(newEntity: InvokeType): void;
    /**
     * Allows to convert serialized data to Command instance
     *
     * [!] By default it omits params as they are not stored in the serialized data
     *
     * @param serialized
     */
    fromJSON(serialized: A_TYPES__Command_Serialized<InvokeType, ResultType>): void;
    /**
     * Converts the Command instance to a plain object
     *
     * @returns
     */
    toJSON(): A_TYPES__Command_Serialized<InvokeType, ResultType>;
    protected checkScopeInheritance(): void;
}

declare class A_CommandError extends A_Error {
    static readonly CommandScopeBindingError = "A-Command Scope Binding Error";
}

interface Ifspolyfill {
    readFileSync: (path: string, encoding: string) => string;
    existsSync: (path: string) => boolean;
    createReadStream: (path: string, options?: BufferEncoding) => any;
}
interface IcryptoInterface {
    createTextHash(text: string, algorithm: string): Promise<string>;
    createFileHash(filePath: string, algorithm: string): Promise<string>;
}
interface IhttpInterface {
    request: (options: any, callback?: (res: any) => void) => any;
    get: (url: string | any, callback?: (res: any) => void) => any;
    createServer: (requestListener?: (req: any, res: any) => void) => any;
}
interface IhttpsInterface {
    request: (options: any, callback?: (res: any) => void) => any;
    get: (url: string | any, callback?: (res: any) => void) => any;
    createServer: (options: any, requestListener?: (req: any, res: any) => void) => any;
}
interface IpathInterface {
    join: (...paths: string[]) => string;
    resolve: (...paths: string[]) => string;
    dirname: (path: string) => string;
    basename: (path: string, ext?: string) => string;
    extname: (path: string) => string;
    relative: (from: string, to: string) => string;
    normalize: (path: string) => string;
    isAbsolute: (path: string) => boolean;
    parse: (path: string) => any;
    format: (pathObject: any) => string;
    sep: string;
    delimiter: string;
}
interface IurlInterface {
    parse: (urlString: string) => any;
    format: (urlObject: any) => string;
    resolve: (from: string, to: string) => string;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
}
interface IbufferInterface {
    from: (data: any, encoding?: string) => any;
    alloc: (size: number, fill?: any) => any;
    allocUnsafe: (size: number) => any;
    isBuffer: (obj: any) => boolean;
    concat: (list: any[], totalLength?: number) => any;
}
interface IprocessInterface {
    env: Record<string, string | undefined>;
    argv: string[];
    platform: string;
    version: string;
    versions: Record<string, string>;
    cwd: () => string;
    exit: (code?: number) => never;
    nextTick: (callback: Function, ...args: any[]) => void;
}

declare enum A_TYPES__ConfigFeature {
}
type A_TYPES__ConfigContainerConstructor<T extends Array<string | A_TYPES__ConceptENVVariables[number]>> = {
    /**
     * If set to true, the SDK will throw an error if the variable is not defined OR not presented in the defaults
     */
    strict: boolean;
    /**
     * Allows to define the names of variable to be loaded
     */
    variables: T;
    /**
     * Allows to set the default values for the variables
     */
    defaults: {
        [key in T[number]]?: any;
    };
} & A_TYPES__Fragment_Constructor;

declare class A_Config<T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]> extends A_Fragment {
    config: A_TYPES__ConfigContainerConstructor<T>;
    private VARIABLES;
    CONFIG_PROPERTIES: T;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(config: Partial<A_TYPES__ConfigContainerConstructor<T>>);
    /**
     * This method is used to get the configuration property by name
     *
     * @param property
     * @returns
     */
    get<_OutType = any>(property: T[number] | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]): _OutType;
    /**
     *
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     *
     * @param variables
     */
    set(variables: Array<{
        property: T[number] | A_TYPES__ConceptENVVariables[number];
        value: any;
    }>): any;
    set(variables: Partial<Record<T[number] | A_TYPES__ConceptENVVariables[number], any>>): any;
    set(property: T[number] | A_TYPES__ConceptENVVariables[number], value: any): any;
}

declare class A_Logger extends A_Component {
    protected scope: A_Scope;
    protected config?: A_Config<any>;
    constructor(scope: A_Scope);
    readonly colors: {
        readonly green: "32";
        readonly blue: "34";
        readonly red: "31";
        readonly yellow: "33";
        readonly gray: "90";
        readonly magenta: "35";
        readonly cyan: "36";
        readonly white: "37";
        readonly pink: "95";
    };
    get scopeLength(): number;
    compile(color: keyof typeof this.colors, ...args: any[]): Array<string>;
    protected get allowedToLog(): boolean;
    log(color: keyof typeof this.colors, ...args: any[]): any;
    log(...args: any[]): any;
    warning(...args: any[]): void;
    error(...args: any[]): void;
    protected log_A_Error(error: A_Error): void;
    protected compile_A_Error(error: A_Error): string;
    protected compile_Error(error: Error): string;
    protected getTime(): string;
}

declare class A_FSPolyfillClass {
    protected logger: A_Logger;
    private _fs;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<Ifspolyfill>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_CryptoPolyfillClass {
    protected logger: A_Logger;
    private _crypto;
    private _initialized;
    private _fsPolyfill?;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(fsPolyfill?: Ifspolyfill): Promise<IcryptoInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_HttpPolyfillClass {
    protected logger: A_Logger;
    private _http;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IhttpInterface>;
    private init;
    private initServer;
    private initBrowser;
    private createMockRequest;
}

declare class A_HttpsPolyfillClass {
    protected logger: A_Logger;
    private _https;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IhttpsInterface>;
    private init;
    private initServer;
    private initBrowser;
    private createMockRequest;
}

declare class A_PathPolyfillClass {
    protected logger: A_Logger;
    private _path;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IpathInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_UrlPolyfillClass {
    protected logger: A_Logger;
    private _url;
    private _initialized;
    get isInitialized(): boolean;
    constructor(logger: A_Logger);
    get(): Promise<IurlInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_BufferPolyfillClass {
    protected logger: A_Logger;
    private _buffer;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IbufferInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_ProcessPolyfillClass {
    protected logger: A_Logger;
    private _process;
    private _initialized;
    get isInitialized(): boolean;
    constructor(logger: A_Logger);
    get(): Promise<IprocessInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_Polyfill extends A_Component {
    protected logger: A_Logger;
    protected _fsPolyfill: A_FSPolyfillClass;
    protected _cryptoPolyfill: A_CryptoPolyfillClass;
    protected _httpPolyfill: A_HttpPolyfillClass;
    protected _httpsPolyfill: A_HttpsPolyfillClass;
    protected _pathPolyfill: A_PathPolyfillClass;
    protected _urlPolyfill: A_UrlPolyfillClass;
    protected _bufferPolyfill: A_BufferPolyfillClass;
    protected _processPolyfill: A_ProcessPolyfillClass;
    protected _initializing: Promise<void> | null;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;
    constructor(logger: A_Logger);
    /**
     * Indicates whether the channel is connected
     */
    get ready(): Promise<void>;
    load(): Promise<void>;
    attachToWindow(): Promise<void>;
    protected _loadInternal(): Promise<void>;
    /**
     * Allows to use the 'fs' polyfill methods regardless of the environment
     * This method loads the 'fs' polyfill and returns its instance
     *
     * @returns
     */
    fs(): Promise<Ifspolyfill>;
    /**
     * Allows to use the 'crypto' polyfill methods regardless of the environment
     * This method loads the 'crypto' polyfill and returns its instance
     *
     * @returns
     */
    crypto(): Promise<IcryptoInterface>;
    /**
     * Allows to use the 'http' polyfill methods regardless of the environment
     * This method loads the 'http' polyfill and returns its instance
     *
     * @returns
     */
    http(): Promise<IhttpInterface>;
    /**
     * Allows to use the 'https' polyfill methods regardless of the environment
     * This method loads the 'https' polyfill and returns its instance
     *
     * @returns
     */
    https(): Promise<IhttpsInterface>;
    /**
     * Allows to use the 'path' polyfill methods regardless of the environment
     * This method loads the 'path' polyfill and returns its instance
     *
     * @returns
     */
    path(): Promise<IpathInterface>;
    /**
     * Allows to use the 'url' polyfill methods regardless of the environment
     * This method loads the 'url' polyfill and returns its instance
     *
     * @returns
     */
    url(): Promise<IurlInterface>;
    /**
     * Allows to use the 'buffer' polyfill methods regardless of the environment
     * This method loads the 'buffer' polyfill and returns its instance
     *
     * @returns
     */
    buffer(): Promise<IbufferInterface>;
    /**
     * Allows to use the 'process' polyfill methods regardless of the environment
     * This method loads the 'process' polyfill and returns its instance
     *
     * @returns
     */
    process(): Promise<IprocessInterface>;
}

declare class A_ConfigLoader extends A_Container {
    private reader;
    prepare(polyfill: A_Polyfill): Promise<void>;
}

declare class A_ConfigError extends A_Error {
    static readonly InitializationError = "A-Config Initialization Error";
}

/**
 * Config Reader
 */
declare class ConfigReader extends A_Component {
    protected polyfill: A_Polyfill;
    constructor(polyfill: A_Polyfill);
    attachContext(container: A_Container, feature: A_Feature): Promise<void>;
    initialize(config: A_Config): Promise<void>;
    /**
     * Get the configuration property by Name
     * @param property
     */
    resolve<_ReturnType = any>(property: string): _ReturnType;
    /**
     * This method reads the configuration and sets the values to the context
     *
     * @returns
     */
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
    /**
     * Finds the root directory of the project by locating the folder containing package.json
     *
     * @param {string} startPath - The initial directory to start searching from (default is __dirname)
     * @returns {string|null} - The path to the root directory or null if package.json is not found
     */
    protected getProjectRoot(startPath?: string): Promise<string>;
}

declare class ENVConfigReader extends ConfigReader {
    readEnvFile(config: A_Config<A_TYPES__ConceptENVVariables>, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_ENV_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

declare class FileConfigReader extends ConfigReader {
    private FileData;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_File_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

declare const A_CONSTANTS__CONFIG_ENV_VARIABLES: {};
type A_TYPES__ConfigENVVariables = (typeof A_CONSTANTS__CONFIG_ENV_VARIABLES)[keyof typeof A_CONSTANTS__CONFIG_ENV_VARIABLES][];
declare const A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY: readonly [];

type A_UTILS_TYPES__Manifest_Init = Array<A_UTILS_TYPES__Manifest_ComponentLevelConfig>;
type A_UTILS_TYPES__Manifest_ComponentLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Component constructor
     */
    component: A_TYPES__Component_Constructor<T>;
    /**
     * Method level configurations for the component
     */
    methods?: Array<A_UTILS_TYPES__Manifest_MethodLevelConfig<T>>;
} & Partial<A_UTILS_TYPES__Manifest_Rules>;
type A_UTILS_TYPES__Manifest_MethodLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Method name from the component provided
     */
    method: string | RegExp;
} & Partial<A_UTILS_TYPES__Manifest_Rules>;
type A_UTILS_TYPES__Manifest_Rules = {
    /**
     * A list of entities to which a component is applied
     *
     * By default is for all
     */
    apply: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp;
    /**
     * A list of entities to which a component is excluded
     */
    exclude: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp;
};
type A_UTILS_TYPES__Manifest_AllowedComponents = A_TYPES__Component_Constructor | A_TYPES__Entity_Constructor | A_TYPES__Fragment_Constructor | A_TYPES__Container_Constructor;
interface A_UTILS_TYPES__ManifestRule {
    componentRegex: RegExp;
    methodRegex: RegExp;
    applyRegex?: RegExp;
    excludeRegex?: RegExp;
}
interface A_UTILS_TYPES__ManifestQuery {
    component: A_TYPES__Component_Constructor;
    method: string;
    target: A_UTILS_TYPES__Manifest_AllowedComponents;
}

/**
 * Fluent API for checking manifest permissions
 */
declare class A_ManifestChecker {
    private manifest;
    private component;
    private method;
    private checkExclusion;
    constructor(manifest: A_Manifest, component: A_TYPES__Component_Constructor, method: string, checkExclusion?: boolean);
    for(target: A_UTILS_TYPES__Manifest_AllowedComponents): boolean;
}

declare class A_Manifest extends A_Fragment {
    private rules;
    /**
     * A-Manifest is a configuration set that allows to include or exclude component application for the particular methods.
     *
     * For example, if A-Scope provides polymorphic A-Component that applies for All A-Entities in it but you have another component that should be used for only One particular Entity, you can use A-Manifest to specify this behavior.
     *
     *
     * By default if Component is provided in the scope - it applies for all entities in it. However, if you want to exclude some entities or include only some entities for the particular component - you can use A-Manifest to define this behavior.
     *
     * @param config - Array of component configurations
     */
    constructor(config?: A_UTILS_TYPES__Manifest_Init);
    /**
     * Should convert received configuration into internal Regexp applicable for internal storage
     */
    protected prepare(config: A_UTILS_TYPES__Manifest_Init): void;
    /**
     * Process a single configuration item and convert it to internal rules
     */
    private processConfigItem;
    /**
     * Convert a constructor to a regex pattern
     */
    private constructorToRegex;
    /**
     * Convert a method name or regex to a regex pattern
     */
    private methodToRegex;
    /**
     * Convert allowed components array or regex to a single regex
     */
    private allowedComponentsToRegex;
    /**
     * Escape special regex characters in a string
     */
    private escapeRegex;
    protected configItemToRegexp(item: A_TYPES__Component_Constructor): RegExp;
    protected ID(component: A_TYPES__Component_Constructor, method: string): string;
    /**
     * Check if a component and method combination is allowed for a target
     */
    isAllowed<T extends A_Component>(ctor: T | A_TYPES__Component_Constructor<T>, method: string): A_ManifestChecker;
    /**
     * Internal method to check if access is allowed
     */
    internal_checkAccess(query: A_UTILS_TYPES__ManifestQuery): boolean;
    isExcluded<T extends A_Component>(ctor: T | A_TYPES__Component_Constructor<T>, method: string): A_ManifestChecker;
}

declare class A_ManifestError extends A_Error {
    static readonly ManifestInitializationError = "A-Manifest Initialization Error";
}

declare class A_Memory<_MemoryType extends Record<string, any> = Record<string, any>, _SerializedType extends Record<string, any> = Record<string, any>> extends A_Fragment {
    /**
     * Internal storage of all intermediate values
     */
    protected _memory: Map<keyof _MemoryType, _MemoryType[keyof _MemoryType]>;
    /**
     * Errors encountered during the execution
     */
    protected _errors: Set<A_Error>;
    /**
     * Memory object that allows to store intermediate values and errors
     *
     * @param initialValues
     */
    constructor(initialValues?: _MemoryType);
    get Errors(): Set<A_Error> | undefined;
    /**
     * Verifies that all required keys are present in the proxy values
     *
     * @param requiredKeys
     * @returns
     */
    verifyPrerequisites(requiredKeys: Array<keyof _MemoryType>): Promise<boolean>;
    /**
     * Adds an error to the context
     *
     * @param error
     */
    error(error: A_Error): Promise<void>;
    /**
     * Retrieves a value from the context memory
     *
     * @param key
     * @returns
     */
    get<K extends keyof _MemoryType>(
    /**
     * Key to retrieve the value for
     */
    key: K): _MemoryType[K] | undefined;
    /**
     * Saves a value in the context memory
     *
     * @param key
     * @param value
     */
    set<K extends keyof _MemoryType>(
    /**
     * Key to save the value under
     */
    key: K, 
    /**
     * Value to save
     */
    value: _MemoryType[K]): Promise<void>;
    /**
     * Removes a value from the context memory by key
     *
     * @param key
     */
    drop(key: keyof _MemoryType): Promise<void>;
    /**
     * Clears all stored values in the context memory
     */
    clear(): Promise<void>;
    /**
     * Converts all stored values to a plain object
     *
     * [!] By default uses all saved in memory values
     *
     * @returns
     */
    toJSON(): _SerializedType;
}

type A_UTILS_TYPES__ScheduleObjectConfig = {
    /**
     * If the timeout is cleared, should the promise resolve or reject?
     * BY Default it rejects
     *
     * !!!NOTE: If the property is set to true, the promise will resolve with undefined
     */
    resolveOnClear: boolean;
};
type A_UTILS_TYPES__ScheduleObjectCallback<T> = () => Promise<T>;

declare class A_ScheduleObject<T extends any = any> {
    private timeout;
    private deferred;
    private config;
    /**
     * Creates a scheduled object that will execute the action after specified milliseconds
     *
     *
     * @param ms - milliseconds to wait before executing the action
     * @param action - the action to execute
     * @param config - configuration options for the schedule object
     */
    constructor(
    /**
     * Milliseconds to wait before executing the action
     */
    ms: number, 
    /**
     * The action to execute after the specified milliseconds
     */
    action: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
     * Configuration options for the schedule object
     */
    config?: A_UTILS_TYPES__ScheduleObjectConfig);
    get promise(): Promise<T>;
    clear(): void;
}

declare class A_Schedule extends A_Component {
    /**
     * Allows to schedule a callback for particular time in the future
     *
     * @param timestamp - Unix timestamp in milliseconds
     * @param callback - The callback to execute
     * @returns A promise that resolves to the schedule object
     */
    schedule<T extends any = any>(
    /**
     * Unix timestamp in milliseconds
     */
    timestamp: number, 
    /**
     * The callback to execute
     */
    callback: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
     * Configuration options for the schedule object
     */
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
    schedule<T extends any = any>(
    /**
     * ISO date string representing the date and time to schedule the callback for
     */
    date: string, 
    /**
     * The callback to execute
     */
    callback: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
    * Configuration options for the schedule object
    */
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
    /**
     * Allows to execute callback after particular delay in milliseconds
     * So the callback will be executed after the specified delay
     *
     * @param ms
     */
    delay<T extends any = any>(
    /**
     * Delay in milliseconds
     */
    ms: number, 
    /**
     * The callback to execute after the delay
     */
    callback: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
    * Configuration options for the schedule object
    */
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
}

declare class A_Deferred<T> {
    promise: Promise<T>;
    private resolveFn;
    private rejectFn;
    /**
     * Creates a deferred promise
     * @returns A promise that can be resolved or rejected later
     */
    constructor();
    resolve(value: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}

export { A_CONSTANTS_A_Command_Features, type A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status, A_CONSTANTS__CONFIG_ENV_VARIABLES, A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY, A_Channel, A_ChannelError, A_Command, A_CommandError, A_Config, A_ConfigError, A_ConfigLoader, A_Deferred, A_Logger, A_Manifest, A_ManifestChecker, A_ManifestError, A_Memory, A_Polyfill, A_Schedule, A_ScheduleObject, type A_TYPES__CommandMeta, A_TYPES__CommandMetaKey, type A_TYPES__Command_Constructor, type A_TYPES__Command_Init, type A_TYPES__Command_Listener, type A_TYPES__Command_Serialized, type A_TYPES__ConfigContainerConstructor, type A_TYPES__ConfigENVVariables, A_TYPES__ConfigFeature, type A_UTILS_TYPES__ManifestQuery, type A_UTILS_TYPES__ManifestRule, type A_UTILS_TYPES__Manifest_AllowedComponents, type A_UTILS_TYPES__Manifest_ComponentLevelConfig, type A_UTILS_TYPES__Manifest_Init, type A_UTILS_TYPES__Manifest_MethodLevelConfig, type A_UTILS_TYPES__Manifest_Rules, type A_UTILS_TYPES__ScheduleObjectCallback, type A_UTILS_TYPES__ScheduleObjectConfig, ConfigReader, ENVConfigReader, FileConfigReader, type IbufferInterface, type IcryptoInterface, type Ifspolyfill, type IhttpInterface, type IhttpsInterface, type IpathInterface, type IprocessInterface, type IurlInterface };
