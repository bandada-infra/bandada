import validators from "./validators"
import { Validator } from "./types"

/**
 * It returns an existing validator. If the validator does not exist
 * it throws an error.
 * @param validatorId The validator id.
 * @returns The validator.
 */
export default function getValidator(validatorId: string): Validator {
    const validator = validators.find((v) => v.id === validatorId)

    if (!validator) {
        throw Error(`Validator '${validatorId}' does not exist`)
    }

    return validator
}
