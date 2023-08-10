import addValidator from "./addValidator"
import { Validator } from "./types"

/**
 * It adds a list of new credential's validators.
 * @param validators The list of validators to be added.
 */
export default function addValidators(validators: Validator[]) {
    for (const validator of validators) {
        addValidator(validator)
    }
}
