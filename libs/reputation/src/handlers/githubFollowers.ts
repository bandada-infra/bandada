import { Handler } from "../types"

// Typescript type for the handler criteria.
// This will be mainly used by this handler.
export type Criteria = {
    minFollowers: number
}

//
export const criteriaTypes = {
    minFollowers: "number"
}

/**
 * It checks if a user has more then 'minFollowers' followers.
 * @param criteria The reputation criteria used to check user's reputation.
 * @param context Utility functions and other context variables.
 * @returns True if the user meets the reputation criteria.
 */
const handler: Handler = async (criteria: Criteria, { utils }) => {
    utils.checkCriteriaTypes(criteria, criteriaTypes)

    const { followers } = await utils.githubAPI("/user")

    return followers >= criteria.minFollowers
}

export default handler
