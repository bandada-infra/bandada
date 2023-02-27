/**
 * Returns the string of a JSON, even if it contains bigint types.
 * @param obj JavaScript object.
 * @returns JSON string
 */
export default function stringifyJSON(obj: Record<string, unknown>): string {
    return JSON.stringify(obj, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
    )
}
