import { Handler } from "../.."

export type Criteria = {
    repository: string
    minCommits: number
}

const name = "GITHUB_REPOSITORY_COMMITS"

const criteriaABI = {
    repository: "string",
    minCommits: "number"
}

/**
 * It checks if a user has more then 'minCommits' commits in a specific repo.
 * @param criteria The reputation criteria used to check user's reputation.
 * @param context Utility functions and other context variables.
 * @returns True if the user meets the reputation criteria.
 */
const validate: Handler = async (criteria: Criteria, { utils }) => {
    utils.checkCriteria(criteria, criteriaABI)

    const { login } = await utils.githubAPI("user")

    let allCommits = []

    for (let i = 0; allCommits.length % 100 === 0; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const commits = await utils.githubAPI(
            `repos/${login}/${criteria.repository}/commits?author=${login}&per_page=100&page=${i}`
        )

        if (commits.length === 0) {
            break
        }

        allCommits = allCommits.concat(commits)
    }

    return allCommits.length >= criteria.minCommits
}

export default {
    name,
    criteriaABI,
    validate
}
