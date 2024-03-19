/**
 * It checks if the criteria parameters are the right ones. Criteria must
 * contain the right parameters and the right types for each of them.
 * @param criteria The credentials to check.
 * @param criteriaABI The criteria ABI.
 */
export default function checkCriteria(criteria: any, criteriaABI: any) {
    for (const parameter in criteriaABI) {
        if (Object.prototype.hasOwnProperty.call(criteriaABI, parameter)) {
            const isOptional = criteriaABI[parameter].optional

            if (!isOptional && criteria[parameter] === undefined) {
                throw Error(`Parameter '${parameter}' has not been defined`)
            }
        }
    }

    for (const parameter in criteria) {
        if (Object.prototype.hasOwnProperty.call(criteria, parameter)) {
            const value = criteria[parameter]

            if (criteriaABI[parameter] === undefined) {
                throw Error(
                    `Parameter '${parameter}' should not be part of the criteria`
                )
            }

            if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                checkCriteria(value, criteriaABI[parameter].type)
            } else if (typeof value !== criteriaABI[parameter].type) {
                throw TypeError(
                    `Parameter '${parameter}' is not a ${criteriaABI[parameter].type}`
                )
            }
        }
    }
}
