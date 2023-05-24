import handlers from "./handlers"
import { Handler, ValidatorName } from "./types"

/**
 * It allows external devs to add a new handler for a validator.
 * @param validatorName The validator name.
 * @param handler The function that will check the reputation criteria.
 */
export default function addHandler(
    validatorName: ValidatorName,
    handler: Handler,
    criteria: any
) {
    handlers[validatorName] = [handler, criteria]
}
