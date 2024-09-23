import { A_TYPES__ASEID_Constructor, A_TYPES__ASEID_JSON } from "../types/ASEID.types";
/**
 *  A - ADAAS
 *  S - System
 *  E - Entity
 *  I - Identifier
 *  D - iDentifier
 *
 *
 *  adaas-sso@scope:usr:0000000001
 *
 *  APP_NAMESPACE + @ + SCOPE + : ENTITY_NAME + : + ID + @ + VERSION
 */
export declare class ASEID {
    static regexp: RegExp;
    /**
     * Namespace for the ASEID
     * Generally it is the application name or code, should correspond to the namespace of the application
     * Could be ID or ASEID
     */
    private _namespace;
    /**
     * Entity Scope the primary location of the resource
     * Organization, or organization Unit
     * Could be ID or ASEID
     *
     */
    private _scope;
    /**
     * Entity Type the type of the resource
     */
    private _entity;
    /**
     * Entity ID the unique identifier of the resource
     */
    private _id;
    /**
     * Version of the entity (optional)
     */
    private _version?;
    /**
     * Shard of the entity (optional)
     */
    private _shard?;
    constructor(aseid: string);
    constructor(props: A_TYPES__ASEID_Constructor);
    get namespace(): string;
    get scope(): string;
    get entity(): string;
    get id(): string;
    get version(): string | undefined;
    get shard(): string | undefined;
    /**
     * Tests if the identity string is an ASEID
     *
     * @param identity
     * @returns
     */
    static isASEID(identity: string): boolean;
    /**
  * Generate an ASEID from a namespace, entity, and id
  *
  * @param props
  * @returns
  */
    static generateASEID(props: A_TYPES__ASEID_Constructor): string;
    /**
     * Parse ASEID into its components
     *
     *
     * @param identity
     * @returns
     */
    static parseASEID(identity: string): A_TYPES__ASEID_JSON;
    toString(): string;
    toJSON(): A_TYPES__ASEID_JSON;
}
