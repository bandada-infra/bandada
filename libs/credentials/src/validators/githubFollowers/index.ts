import { Validator } from "../.."

export type Criteria = {
    minFollowers: number
}

const validator: Validator = {
    id: "GITHUB_FOLLOWERS",

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
        if ("profile" in context)
            return context.profile.followers >= criteria.minFollowers
        throw new Error("No profile object found")
    }
}

export default validator
