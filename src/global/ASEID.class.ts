import { A_CONSTANTS__DEFAULT_ERRORS } from "../constants/errors.constants";
import { A_CommonHelper } from "../helpers/A_Common.helper";
import { A_TYPES__ASEID_Constructor, A_TYPES__ASEID_JSON } from "../types/ASEID.types";
import { A_Error } from "./A_Error.class";


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
export class ASEID {

    static regexp: RegExp = new RegExp(`^[a-z|A-Z|0-9]+@[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|-]+(@v[0-9]+|@lts)?$`)


    /**
     * Namespace for the ASEID 
     * Generally it is the application name or code, should correspond to the namespace of the application
     * Could be ID or ASEID
     */
    private _namespace!: string;

    /**
     * Entity Scope the primary location of the resource 
     * Organization, or organization Unit
     * Could be ID or ASEID
     * 
     */
    private _scope!: string

    /**
     * Entity Type the type of the resource
     */
    private _entity!: string

    /**
     * Entity ID the unique identifier of the resource
     */
    private _id!: string


    /**
     * Version of the entity (optional)
     */
    private _version?: string

    /**
     * Shard of the entity (optional)
     */
    private _shard?: string


    constructor(
        aseid: string
    )
    constructor(
        props: A_TYPES__ASEID_Constructor
    )
    constructor(param1: string | A_TYPES__ASEID_Constructor) {

        if (typeof param1 === 'string' && !ASEID.isASEID(param1)) {
            throw new A_Error(A_CONSTANTS__DEFAULT_ERRORS.INVALID_ASEID)
        }

        const aseidString = typeof param1 === 'string' ? param1 : ASEID.generateASEID(param1);

        const { namespace, scope, entity, id, version, shard } = ASEID.parseASEID(aseidString);

        this._namespace = namespace;
        this._scope = scope;
        this._entity = entity;
        this._id = id;
        this._version = version;
        this._shard = shard;
    }


    get namespace(): string {
        return this._namespace;
    }

    get scope(): string {
        return this._scope;
    }

    get entity(): string {
        return this._entity;
    }

    get id(): string {
        return this._id;
    }

    get version(): string | undefined {
        return this._version;
    }

    get shard(): string | undefined {
        return this._shard;
    }


    /**
     * Tests if the identity string is an ASEID
     * 
     * @param identity 
     * @returns 
     */
    static isASEID(identity: string): boolean {
        return this.regexp.test(
            identity
        )
    }

    /**
  * Generate an ASEID from a namespace, entity, and id
  * 
  * @param props 
  * @returns 
  */
    static generateASEID(
        props: A_TYPES__ASEID_Constructor
    ): string {

        const namespace = props.namespace
            ? this.isASEID(props.namespace)
                ? this.parseASEID(props.namespace).id
                : props.namespace
            : process.env.A_NAMESPACE;

        const scope = typeof props.scope === 'number'
            ? A_CommonHelper.formatWithLeadingZeros(props.scope) :
            this.isASEID(props.scope)
                ? this.parseASEID(props.scope).id
                : props.scope;

        const entity = props.entity;

        const id = typeof props.id === 'number'
            ? A_CommonHelper.formatWithLeadingZeros(props.id)
            : props.id;

        const version = props.version;

        const shard = !props.shard ? undefined : props.shard;


        return `${namespace}@${scope}:${entity}:${shard ? (shard + '--' + id) : id}${version ? ('@' + version) : ''}`
    }


    /**
     * Parse ASEID into its components
     * 
     * 
     * @param identity 
     * @returns 
     */
    static parseASEID(identity: string): A_TYPES__ASEID_JSON {

        const [namespace, body, version] = identity.split('@');
        const [scope, entity, idCandidate] = body.split(':');

        const shard = idCandidate.includes('--') ? idCandidate.split('--')[0] : undefined;
        const id = idCandidate.includes('--') ? idCandidate.split('--')[1] : idCandidate;

        return {
            namespace,
            scope: scope,
            entity,
            id: id,
            version: version ? version : undefined,
            shard
        };
    }


    toString(): string {
        return ASEID.generateASEID({
            namespace: this._namespace,
            scope: this._scope,
            entity: this._entity,
            id: this._id,
            version: this._version,
            shard: this._shard
        })
    }


    toJSON(): A_TYPES__ASEID_JSON {
        return {
            namespace: this._namespace,
            scope: this._scope,
            entity: this._entity,
            id: this._id,
            version: this._version,
            shard: this._shard
        }
    }
}