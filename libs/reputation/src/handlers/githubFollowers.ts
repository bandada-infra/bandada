import { ReputationHandler } from "../types"

/**
 * It checks if a user has more then 'minFollowers' followers.
 * @param parameters The parameters used to check user's reputation.
 * @param context Utility functions and other context variables.
 * @returns True if the user meets the reputation criteria.
 */
const handler: ReputationHandler = async (
    { minFollowers }: { minFollowers: number },
    { utils }
) => {
    const { followers } = await utils.githubAPI("/user")

    return followers >= minFollowers
}

export default handler
