import checkCriteria from "./checkCriteria"
import getAPI from "./getAPI"
import getProvider from "./getProvider"
import getValidator from "./getValidator"
import { Context, Credentials } from "./types"

/**
 * It checks if the user meets the credentials of a group.
 * It also adds utility functions to the credentials context that
 * can be used by validators.
 * @param credentials The credentials of a group.
 * @param context A set of context variables.
 * @returns True if the user meets the credentials.
 */
export default async function validateCredentials(
    { id, criteria }: Credentials,
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
