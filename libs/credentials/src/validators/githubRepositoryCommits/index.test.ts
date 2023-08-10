import { testUtils, validateCredentials } from "../.."
import githubRepositoryCommits from "./index"

describe("GithubRepositoryCommits", () => {
    it("Should return true if a Github user's repository has more than 100 commits", async () => {
        testUtils.mockAPIOnce(Array.from(Array(100).keys()))
        testUtils.mockAPIOnce(Array.from(Array(80).keys()))

        const result = await validateCredentials(
            {
                id: githubRepositoryCommits.id,
                criteria: {
                    repository: "hello-worId",
                    minCommits: 100
                }
            },
            {
                profile: { login: "octocat" },
                accessTokens: { github: "token" }
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubRepositoryCommits.id,
                    criteria: { repository: "hello-worId" }
                },
                {
                    profile: { login: "octocat" },
                    accessTokens: { github: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minCommits' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubRepositoryCommits.id,
                    criteria: {
                        repository: "hello-worId",
                        minCommits: 100,
                        minStars: 200
                    }
                },
                {
                    profile: { login: "octocat" },
                    accessTokens: { github: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minStars' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubRepositoryCommits.id,
                    criteria: {
                        repository: 2,
                        minCommits: 100
                    }
                },
                {
                    profile: { login: "octocat" },
                    accessTokens: { github: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'repository' is not a string"
        )
    })
})
