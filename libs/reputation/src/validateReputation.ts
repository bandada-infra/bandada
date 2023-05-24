import checkCriteriaTypes from "./checkCriteriaTypes"
import getAPI from "./getAPI"
import handlers from "./handlers"
import { Context, Validator } from "./types"

/**
 * It checks if the user meets the reputation criteria of a group.
 * It also adds utility functions to the reputation context that
 * can be used by handlers.
 * @param validator The reputation validator of the group.
 * @param context A set of context variables from Bandada back-end.
 * @returns True if the user meets the reputation criteria.
 */
export default async function validateReputation(
    validator: Validator,
    context: Context
): Promise<boolean> {
    context.utils = {
        checkCriteriaTypes
    }

    if (context.githubAccessToken) {
        context.utils.githubAPI = getAPI(
            "https://api.github.com",
            `Bearer ${context.githubAccessToken}`
        )
    }

    // TODO: add API utils for Reddit and Twitter.

    // TODO: handle logic operators.

    return handlers[validator.name][0](validator.criteria, context)
}
