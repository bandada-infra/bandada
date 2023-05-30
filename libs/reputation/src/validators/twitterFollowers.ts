import { Handler } from "../types"

// Typescript type for the handler criteria.
// This will be mainly used by this handler.
export type Criteria = {
    minFollowers: number
}

// The validator name. It should be unique and capitalized (snake case).
const name = "TWITTER_FOLLOWERS"

// The criteria application binary interface. It contains
// the structure of this validator reputation criteria
// with its parameter types.
const criteriaABI = {
    minFollowers: "number"
}

/**
 * It checks if a user has more then 'minFollowers' followers.
 * @param criteria The reputation criteria used to check user's reputation.
 * @param context Utility functions and other context variables.
 * @returns True if the user meets the reputation criteria.
 */
const validate: Handler = async (criteria: Criteria, { utils }) => {
    utils.checkCriteria(criteria, criteriaABI)

    const { data } = await utils.twitterAPI("users/me")

    return data.public_metrics.followers_count >= criteria.minFollowers
}

export default {
    name,
    criteriaABI,
    validate
}
