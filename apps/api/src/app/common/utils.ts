import { ObjectLiteral } from "typeorm"

/**
 * Returns the string of a JSON, even if it contains bigint types.
 * @param obj JavaScript object.
 * @returns JSON string
 */
export function stringifyJSON(obj: Record<string, unknown>): string {
    return JSON.stringify(obj, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
    )
}

/**
 * Returns an entity without internal DB parameters.
 * @param entity Entity object.
 * @returns Entity without internal parameters.
 */
export function mapEntity<Entity extends ObjectLiteral>(
    entity: Entity
): Omit<Entity, "id"> {
    delete entity.id

    return entity
}
