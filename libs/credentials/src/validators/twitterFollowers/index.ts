import { Validator } from "../.."

export type Criteria = {
    minFollowers: number
}

const validator: Validator = {
    id: "TWITTER_FOLLOWERS",

    criteriaABI: {
        minFollowers: {
            type: "number",
            optional: false
        }
    },

    /**
     * It checks if a user has greater than or equal to 'minFollowers' followers.
     * @param criteria The criteria used to check user's credentials.
     * @param context Utility functions and other context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context) {
        if ("utils" in context && context.utils) {
            const { data } = await context.utils.api(
                "users/me?user.fields=public_metrics"
            )

            return data.public_metrics.followers_count >= criteria.minFollowers
        }
        throw new Error("No utils object found")
    }
}

export default validator
