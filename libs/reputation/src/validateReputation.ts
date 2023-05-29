import checkCriteria from "./checkCriteria"
import getAPI from "./getAPI"
import { Context, ReputationCriteria } from "./types"
import validators from "./validators"

/**
 * It checks if the user meets the reputation criteria of a group.
 * It also adds utility functions to the reputation context that
 * can be used by validators.
 * @param validatorName The validator name.
 * @param criteria The validator criteria.
 * @param context A set of context variables.
 * @returns True if the user meets the reputation criteria.
 */
export default async function validateReputation(
    { name, criteria }: ReputationCriteria,
    context: Context
): Promise<boolean> {
    context.utils = {
        checkCriteria
    }

    if (context.githubAccessToken) {
        context.utils.githubAPI = getAPI(
            "https://api.github.com",
            `Bearer ${context.githubAccessToken}`
        )
    }

    // TODO: add API utils for Reddit and Twitter.

    // TODO: handle logic operators.

    const validator = validators.find((v) => v.name === name)

    if (!validator) {
        throw Error(`Validator '${name}' does not exist`)
    }

    return validator.validate(criteria, context)
}
