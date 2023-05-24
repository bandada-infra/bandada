import { Handler } from "../types"

// Typescript type for the handler parameters.
// This will be mainly used by this handler.
export type Parameters = {
    minFollowers: number
}

//
export const parameterTypes = {
    minFollowers: "number"
}

/**
 * It checks if a user has more then 'minFollowers' followers.
 * @param parameters The parameters used to check user's reputation.
 * @param context Utility functions and other context variables.
 * @returns True if the user meets the reputation criteria.
 */
const handler: Handler = async (parameters: Parameters, { utils }) => {
    utils.checkParameterTypes(parameters, parameterTypes)

    const { followers } = await utils.githubAPI("/user")

    return followers >= parameters.minFollowers
}

export default handler
