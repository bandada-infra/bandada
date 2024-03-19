import { Validator } from "../.."

export type Criteria = {
    repository: string
    minCommits: number
}

const validator: Validator = {
    id: "GITHUB_REPOSITORY_COMMITS",

    criteriaABI: {
        minCommits: {
            type: "number",
            optional: false
        },
        repository: {
            type: "string",
            optional: false
        }
    },

    /**
     * It checks if a user has greater than or equal to 'minCommits' commits in a specific repo.
     * @param criteria The criteria used to check user's credentials.
     * @param context Utility functions and other context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context) {
        if ("profile" in context && context.utils) {
            let allCommits = []

            const [repoOwner, repoName] = criteria.repository.split("/", 2)

            for (let i = 0; allCommits.length % 100 === 0; i += 1) {
                // eslint-disable-next-line no-await-in-loop
                const commits = await context.utils.api(
                    `repos/${repoOwner}/${repoName}/commits?author=${context.profile.login}&per_page=100&page=${i}`
                )

                if (commits.length === 0) {
                    break
                }

                allCommits = allCommits.concat(commits)
            }

            return allCommits.length >= criteria.minCommits
        }
        throw new Error("No profile or utils object found")
    }
}

export default validator
