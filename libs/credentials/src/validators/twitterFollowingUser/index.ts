import { Validator } from "../../types"

export type Criteria = {
    username: string
}

const validator: Validator = {
    id: "TWITTER_FOLLOWING_USER",

    criteriaABI: {
        username: {
            type: "string",
            optional: false
        }
    },

    /**
     * It checks if a Twitter user follows a specific page.
     * @param criteria The criteria used to check user's credentials.
     * @param context Utility functions and other context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context) {
        if ("profile" in context && context.utils) {
            let allFollowing = []
            let nextToken = null

            for (let i = 0; nextToken !== undefined; i += 1) {
                // eslint-disable-next-line no-await-in-loop
                const { data: followingData, meta } = await context.utils.api(
                    `users/${context.profile.id}/following?max_results=1000${
                        nextToken ? `&pagination_token=${nextToken}` : ""
                    }`
                )

                nextToken = meta?.next_token

                allFollowing = allFollowing.concat(followingData)
            }

            return allFollowing.some(
                ({ username }) => username === criteria.username
            )
        }
        throw new Error("No utils or profile object found")
    }
}

export default validator
