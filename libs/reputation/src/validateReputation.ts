import checkCriteria from "./checkCriteria"
import getAPI from "./getAPI"
import getProvider from "./getProvider"
import getValidator from "./getValidator"
import { Context, ReputationCriteria } from "./types"

/**
 * It checks if the user meets the reputation criteria of a group.
 * It also adds utility functions to the reputation context that
 * can be used by validators.
 * @param reputationCriteria The reputation criteria of a group.
 * @param context A set of context variables.
 * @returns True if the user meets the reputation criteria.
 */
export default async function validateReputation(
    { id, criteria }: ReputationCriteria,
    context: Omit<Context, "utils">
): Promise<boolean> {
    const validator = getValidator(id)
    const provider = getProvider(id.split("_")[0].toLowerCase())

    checkCriteria(criteria, validator.criteriaABI)

    return validator.validate(criteria, {
        ...context,
        utils: {
            api: getAPI(provider.apiURL, context.accessTokens[provider.name])
        }
    })
}
