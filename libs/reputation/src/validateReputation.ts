import reputationHandlers from "./reputationHandlers"
import request from "./request"
import { ReputationContext, ReputationCriteria } from "./types"

export default function validateReputation(
    criteria: ReputationCriteria,
    context: ReputationContext
): boolean {
    context.utils = {}

    if (context.githubAccessToken) {
        context.utils.githubAPI = request(
            "https://api.github.com",
            `Bearer ${context.githubAccessToken}`
        )
    }

    // TODO: add API utils for Reddit and Twitter.

    // TODO: handle logic operators.

    return reputationHandlers[criteria.type](criteria.parameters, context)
}
