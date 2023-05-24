import reputationHandlers from "./reputationHandlers"
import getAPI from "./getAPI"
import { ReputationContext, ReputationCriteria } from "./types"

/**
 * It checks if the user meets the reputation criteria of a group.
 * It also adds utility functions to the reputation context that
 * can be used by handlers.
 * @param criteria The reputation criteria of the group.
 * @param context A set of context variables from Bandada back-end.
 * @returns True if the user meets the reputation criteria.
 */
export default async function validateReputation(
    criteria: ReputationCriteria,
    context: ReputationContext
): Promise<boolean> {
    context.utils = {}

    if (context.githubAccessToken) {
        context.utils.githubAPI = getAPI(
            "https://api.github.com",
            `Bearer ${context.githubAccessToken}`
        )
    }

    // TODO: add API utils for Reddit and Twitter.

    // TODO: handle logic operators.

    return reputationHandlers[criteria.type](criteria.parameters, context)
}
