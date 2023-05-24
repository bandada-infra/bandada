/**
 * It checks if the criteria parameters have the right types.
 * If 1 or more of them don't have the right type it will
 * throw a type exception.
 * @param criteria The reputation criteria to check.
 * @param types The types criteria parameters should have.
 */
export default function checkCriteriaTypes(criteria: any, types: any) {
    Object.keys(criteria).forEach((key) => {
        if (typeof criteria[key] === "object" && criteria[key] !== null) {
            checkCriteriaTypes(criteria[key], types[key])
        } else if (typeof criteria[key] !== types[key]) {
            throw TypeError(`Parameter '${key}' is not a ${types[key]}`)
        }
    })
}
