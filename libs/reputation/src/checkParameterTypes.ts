/**
 * It checks if the parameters have the right types.
 * If 1 or more of them don't have the right type it will
 * throw a type exception.
 * @param parameters The parameters values to check.
 * @param types The types parameters should have.
 */
export default function checkParameterTypes(parameters: any, types: any) {
    Object.keys(parameters).forEach((key) => {
        if (typeof parameters[key] === "object" && parameters[key] !== null) {
            checkParameterTypes(parameters[key], types[key])
        } else if (typeof parameters[key] !== types[key]) {
            throw TypeError(`Parameter '${key}' is not a ${types[key]}`)
        }
    })
}
