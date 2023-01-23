import { ObjectLiteral } from "typeorm"

/**
 * Returns an entity without internal DB parameters.
 * @param entity Entity object.
 * @returns Entity without internal parameters.
 */
export default function mapEntity<Entity extends ObjectLiteral>(
    entity: Entity
): Omit<Entity, "id"> {
    delete entity.id

    return entity
}
