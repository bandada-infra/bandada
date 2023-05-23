import reputationHandlers from "./reputationHandlers"
import { ReputationHandler, ReputationType } from "./types"

export default function addReputationHandler(
    reputationType: ReputationType,
    reputationHandler: ReputationHandler
) {
    reputationHandlers[reputationType] = reputationHandler
}
