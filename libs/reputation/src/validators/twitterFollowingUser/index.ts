import { Handler } from "../.."

export type Criteria = {
    username: string
}

const name = "TWITTER_FOLLOWING_USER"

const criteriaABI = {
    username: "string"
}

/**
 * It checks if a Twitter user follows a specific page.
 * @param criteria The reputation criteria used to check user's reputation.
 * @param context Utility functions and other context variables.
 * @returns True if the user meets the reputation criteria.
 */
const validate: Handler = async (criteria: Criteria, { utils }) => {
    utils.checkCriteria(criteria, criteriaABI)

    const { data: userData } = await utils.twitterAPI("users/me")

    let allFollowing = []
    let nextToken = null

    for (let i = 0; nextToken !== undefined; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const { data: followingData, meta } = await utils.twitterAPI(
            `users/${userData.id}/following?max_results=1000${
                nextToken ? `&pagination_token=${nextToken}` : ""
            }`
        )

        nextToken = meta?.next_token

        allFollowing = allFollowing.concat(followingData)
    }

    return allFollowing.some(({ username }) => username === criteria.username)
}

export default {
    name,
    criteriaABI,
    validate
}
