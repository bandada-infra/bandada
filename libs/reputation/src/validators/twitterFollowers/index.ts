import { Validator } from "../.."

export type Criteria = {
    minFollowers: number
}

const validator: Validator = {
    id: "TWITTER_FOLLOWERS",

    criteriaABI: {
        minFollowers: "number"
    },

    /**
     * It checks if a user has more then 'minFollowers' followers.
     * @param criteria The reputation criteria used to check user's reputation.
     * @param context Utility functions and other context variables.
     * @returns True if the user meets the reputation criteria.
     */
    async validate(criteria: Criteria, { utils }) {
        const { data } = await utils.api("users/me?user.fields=public_metrics")

        return data.public_metrics.followers_count >= criteria.minFollowers
    }
}

export default validator
