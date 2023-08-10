import { Validator } from "./types"
import validators from "./validators"

/**
 * It adds a new credential's validator.
 * @param validator The validator to be added.
 */
export default function addValidator(validator: Validator) {
    validators.push(validator)
}
