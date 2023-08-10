import { Validator } from "../.."

export type Criteria = {
    repository: string
    minCommits: number
}

const validator: Validator = {
    id: "GITHUB_REPOSITORY_COMMITS",

    criteriaABI: {
        repository: "string",
        minCommits: "number"
    },

    /**
     * It checks if a user has more then 'minCommits' commits in a specific repo.
     * @param criteria The criteria used to check user's credentials.
     * @param context Utility functions and other context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, { utils, profile }) {
        let allCommits = []

        for (let i = 0; allCommits.length % 100 === 0; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const commits = await utils.api(
                `repos/${profile.login}/${criteria.repository}/commits?author=${profile.login}&per_page=100&page=${i}`
            )

            if (commits.length === 0) {
                break
            }

            allCommits = allCommits.concat(commits)
        }

        return allCommits.length >= criteria.minCommits
    }
}

export default validator
