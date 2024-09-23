import { A_CONSTANTS__DEFAULT_ERRORS } from "../constants/errors.constants";
import {
    A_TYPES__AEntity_JSON,
    A_TYPES__IAEntity
} from "../types/A_Entity.types";
import { A_Error } from "./A_Error.class";
import { ASEID } from "./ASEID.class";

export class A_Entity<
    _ConstructorType = any,
    _SerializedType extends A_TYPES__AEntity_JSON = A_TYPES__AEntity_JSON,
>
    implements A_TYPES__IAEntity {

    aseid!: ASEID;


    constructor(
        aseid: string
    )
    constructor(
        aseid: ASEID
    )
    constructor(
        serialized: _SerializedType
    )
    constructor(
        newEntity: _ConstructorType
    )
    constructor(props: string | ASEID | _SerializedType | _ConstructorType) {

        switch (true) {
            case (typeof props === 'string' && ASEID.isASEID(props)):
                this.aseid = new ASEID(props);
                break;
            case (props instanceof ASEID):
                this.aseid = props;
                break;
            case (typeof props === 'object' && (props as any).aseid):
                this.fromSerialized(props as _SerializedType);
                break;

            case (typeof props === 'object'):
                this.fromNewEntity(props as _ConstructorType);
                break

            default:
                throw new A_Error(A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
        }

    }

    // ====================================================================
    // ================== DUPLICATED ASEID Getters ========================
    // ====================================================================

    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id(): string | number {
        return this.aseid.id;
    }

    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace(): string {
        return this.aseid.namespace
    }

    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope(): string {
        return this.aseid.scope;
    }

    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     */
    get entity(): string {
        return this.aseid.entity;
    }

    /**
     * Extracts the version from the ASEID
     * version is the version of the entity
     */

    get version(): string | undefined {
        return this.aseid.version;
    }

    /**
     * Extracts the shard from the ASEID
     * shard is the shard of the entity
     */
    get shard(): string | undefined {
        return this.aseid.shard;
    }


    protected fromNewEntity(newEntity: _ConstructorType): void {
        return;
    }

    protected fromSerialized(serialized: _SerializedType): void {
        this.aseid = new ASEID((serialized).aseid);
        return;
    }


    /**
     * Converts the entity to a JSON object 
     * 
     * 
     * @returns 
     */
    toJSON(): _SerializedType {
        return {
            aseid: this.aseid.toString()
        } as _SerializedType;
    }



    toString(): string {
        return this.aseid.toString();
    }
}
