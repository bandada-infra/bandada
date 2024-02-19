import checkCriteria from "./checkCriteria"
import getAPI from "./getAPI"
import getProvider from "./getProvider"
import getValidator from "./getValidator"
import { Context, Credentials, Web2Provider } from "./types"

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
    context: Context
): Promise<boolean> {
    const validator = getValidator(id)
    const provider = getProvider(id.split("_")[0].toLowerCase())

    checkCriteria(criteria, validator.criteriaABI)
    if ("apiURL" in provider && "accessTokens" in context) {
        return validator.validate(criteria, {
            ...context,
            utils: {
                api: getAPI(
                    (provider as Web2Provider).apiURL!,
                    context.accessTokens[provider.name]
                )
            }
        })
    }

    if ("getAddress" in provider || "queryGraph" in provider) {
        return validator.validate(criteria, {
            ...context
        })
    }

    throw new Error("Credentials cannot be validated")
}
