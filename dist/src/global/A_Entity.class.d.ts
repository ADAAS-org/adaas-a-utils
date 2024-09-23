import { A_TYPES__AEntity_JSON, A_TYPES__IAEntity } from "../types/A_Entity.types";
import { ASEID } from "./ASEID.class";
export declare class A_Entity<_ConstructorType = any, _SerializedType extends A_TYPES__AEntity_JSON = A_TYPES__AEntity_JSON> implements A_TYPES__IAEntity {
    aseid: ASEID;
    constructor(aseid: string);
    constructor(aseid: ASEID);
    constructor(serialized: _SerializedType);
    constructor(newEntity: _ConstructorType);
    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id(): string | number;
    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace(): string;
    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope(): string;
    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     */
    get entity(): string;
    /**
     * Extracts the version from the ASEID
     * version is the version of the entity
     */
    get version(): string | undefined;
    /**
     * Extracts the shard from the ASEID
     * shard is the shard of the entity
     */
    get shard(): string | undefined;
    protected fromNewEntity(newEntity: _ConstructorType): void;
    protected fromSerialized(serialized: _SerializedType): void;
    /**
     * Converts the entity to a JSON object
     *
     *
     * @returns
     */
    toJSON(): _SerializedType;
    toString(): string;
}
