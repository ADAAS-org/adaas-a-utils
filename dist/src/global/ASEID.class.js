"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASEID = void 0;
const errors_constants_1 = require("../constants/errors.constants");
const A_Common_helper_1 = require("../helpers/A_Common.helper");
const A_Error_class_1 = require("./A_Error.class");
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
class ASEID {
    constructor(param1) {
        if (typeof param1 === 'string' && !ASEID.isASEID(param1)) {
            throw new A_Error_class_1.A_Error(errors_constants_1.A_CONSTANTS__DEFAULT_ERRORS.INVALID_ASEID);
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
    get namespace() {
        return this._namespace;
    }
    get scope() {
        return this._scope;
    }
    get entity() {
        return this._entity;
    }
    get id() {
        return this._id;
    }
    get version() {
        return this._version;
    }
    get shard() {
        return this._shard;
    }
    /**
     * Tests if the identity string is an ASEID
     *
     * @param identity
     * @returns
     */
    static isASEID(identity) {
        return this.regexp.test(identity);
    }
    /**
  * Generate an ASEID from a namespace, entity, and id
  *
  * @param props
  * @returns
  */
    static generateASEID(props) {
        const namespace = props.namespace
            ? this.isASEID(props.namespace)
                ? this.parseASEID(props.namespace).id
                : props.namespace
            : process.env.A_NAMESPACE;
        const scope = typeof props.scope === 'number'
            ? A_Common_helper_1.A_CommonHelper.formatWithLeadingZeros(props.scope) :
            this.isASEID(props.scope)
                ? this.parseASEID(props.scope).id
                : props.scope;
        const entity = props.entity;
        const id = typeof props.id === 'number'
            ? A_Common_helper_1.A_CommonHelper.formatWithLeadingZeros(props.id)
            : props.id;
        const version = props.version;
        const shard = !props.shard ? undefined : props.shard;
        return `${namespace}@${scope}:${entity}:${shard ? (shard + '--' + id) : id}${version ? ('@' + version) : ''}`;
    }
    /**
     * Parse ASEID into its components
     *
     *
     * @param identity
     * @returns
     */
    static parseASEID(identity) {
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
    toString() {
        return ASEID.generateASEID({
            namespace: this._namespace,
            scope: this._scope,
            entity: this._entity,
            id: this._id,
            version: this._version,
            shard: this._shard
        });
    }
    toJSON() {
        return {
            namespace: this._namespace,
            scope: this._scope,
            entity: this._entity,
            id: this._id,
            version: this._version,
            shard: this._shard
        };
    }
}
exports.ASEID = ASEID;
ASEID.regexp = new RegExp(`^[a-z|A-Z|0-9]+@[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|-]+(@v[0-9]+|@lts)?$`);
//# sourceMappingURL=ASEID.class.js.map