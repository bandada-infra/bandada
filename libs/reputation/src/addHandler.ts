import handlers from "./handlers"
import { Handler, CriteriaName } from "./types"

/**
 * It allows external devs to add a new handler.
 * @param criteriaName The criteria name.
 * @param handler The function that will check the criteria.
 */
export default function addHandler(
    criteriaName: CriteriaName,
    handler: Handler,
    parameterTypes: any
) {
    handlers[criteriaName] = [handler, parameterTypes]
}
