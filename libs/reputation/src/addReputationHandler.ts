import reputationHandlers from "./reputationHandlers"
import { ReputationHandler, ReputationType } from "./types"

/**
 * It allows external devs to add a new reputation handler.
 * @param reputationType The reputation type.
 * @param reputationHandler The function that will check the reputation criteria.
 */
export default function addReputationHandler(
    reputationType: ReputationType,
    reputationHandler: ReputationHandler
) {
    reputationHandlers[reputationType] = reputationHandler
}
