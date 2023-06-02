import { Validator } from "./types"
import validators from "./validators"

/**
 * It adds a new reputation validator.
 * @param validator The validator to be added.
 */
export default function addValidator(validator: Validator) {
    validators.push(validator)
}
