"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Entity = void 0;
const errors_constants_1 = require("../constants/errors.constants");
const A_Error_class_1 = require("./A_Error.class");
const ASEID_class_1 = require("./ASEID.class");
class A_Entity {
    constructor(props) {
        switch (true) {
            case (typeof props === 'string' && ASEID_class_1.ASEID.isASEID(props)):
                this.aseid = new ASEID_class_1.ASEID(props);
                break;
            case (props instanceof ASEID_class_1.ASEID):
                this.aseid = props;
                break;
            case (typeof props === 'object' && props.aseid):
                this.fromSerialized(props);
                break;
            case (typeof props === 'object'):
                this.fromNewEntity(props);
                break;
            default:
                throw new A_Error_class_1.A_Error(errors_constants_1.A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
        }
    }
    // ====================================================================
    // ================== DUPLICATED ASEID Getters ========================
    // ====================================================================
    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id() {
        return this.aseid.id;
    }
    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace() {
        return this.aseid.namespace;
    }
    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope() {
        return this.aseid.scope;
    }
    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     */
    get entity() {
        return this.aseid.entity;
    }
    /**
     * Extracts the version from the ASEID
     * version is the version of the entity
     */
    get version() {
        return this.aseid.version;
    }
    /**
     * Extracts the shard from the ASEID
     * shard is the shard of the entity
     */
    get shard() {
        return this.aseid.shard;
    }
    fromNewEntity(newEntity) {
        return;
    }
    fromSerialized(serialized) {
        this.aseid = new ASEID_class_1.ASEID((serialized).aseid);
        return;
    }
    /**
     * Converts the entity to a JSON object
     *
     *
     * @returns
     */
    toJSON() {
        return {
            aseid: this.aseid.toString()
        };
    }
    toString() {
        return this.aseid.toString();
    }
}
exports.A_Entity = A_Entity;
//# sourceMappingURL=A_Entity.class.js.map