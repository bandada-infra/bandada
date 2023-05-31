import { Handler } from "../.."

export type Criteria = {
    minFollowers: number
}

const name = "GITHUB_FOLLOWERS"

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

    const { followers } = await utils.githubAPI("user")

    return followers >= criteria.minFollowers
}

export default {
    name,
    criteriaABI,
    validate
}
