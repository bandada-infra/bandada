import { addValidator, testUtils, validateReputation } from "../.."
import githubRepositoryCommits from "./index"

global.fetch = jest.fn()

describe("GithubRepositoryCommits", () => {
    beforeAll(() => {
        addValidator(githubRepositoryCommits)
    })

    it("Should return true if a Github user's repository has more than 100 commits", async () => {
        testUtils.mockAPIOnce({ login: "octocat" })
        testUtils.mockAPIOnce(Array.from(Array(100).keys()))
        testUtils.mockAPIOnce(Array.from(Array(80).keys()))

        const result = await validateReputation(
            {
                name: "GITHUB_REPOSITORY_COMMITS",
                criteria: {
                    repository: "hello-worId",
                    minCommits: 100
                }
            },
            { githubAccessToken: "token" }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "GITHUB_REPOSITORY_COMMITS",
                    criteria: { repository: "hello-worId" }
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minCommits' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "GITHUB_REPOSITORY_COMMITS",
                    criteria: {
                        repository: "hello-worId",
                        minCommits: 100,
                        minStars: 200
                    }
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minStars' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "GITHUB_REPOSITORY_COMMITS",
                    criteria: {
                        repository: 2,
                        minCommits: 100
                    }
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'repository' is not a string"
        )
    })
})
