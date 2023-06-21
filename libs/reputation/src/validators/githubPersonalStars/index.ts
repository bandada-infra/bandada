import { Validator } from "../../types"

export type Criteria = {
    minStars: number
}

const validator: Validator = {
    id: "GITHUB_PERSONAL_STARS",

    criteriaABI: {
        minStars: "number"
    },

    /**
     * It checks if a user has more then 'minStars' stars in their personal repository.
     * @param criteria The reputation criteria used to check user's reputation.
     * @param context Utility functions and other context variables.
     * @returns True if the user meets the reputation criteria.
     */
    async validate(criteria: Criteria, { utils }) {
        let allRepositories = []

        for (let i = 0; allRepositories.length % 100 === 0; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const repositories = await utils.api(
                `user/repos?per_page=100&page=${i}`
            )

            if (repositories.length === 0) {
                break
            }

            allRepositories = allRepositories.concat(repositories)
        }

        const stars = allRepositories.reduce(
            (accumulator: number, currentValue: any) =>
                accumulator + currentValue.stargazers_count,
            0
        )

        return stars >= criteria.minStars
    }
}

export default validator
