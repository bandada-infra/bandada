import { testUtils, validateCredentials } from "../.."
import githubPersonalStars from "./index"

describe("GithubPersonalStars", () => {
    it("Should return true if a Github user has more than 100 stars in their personal repositories", async () => {
        testUtils.mockAPIOnce(
            Array.from(Array(100).keys()).map(() => ({ stargazers_count: 0 }))
        )
        testUtils.mockAPIOnce(
            Array.from(Array(20).keys()).map(() => ({ stargazers_count: 10 }))
        )

        const result = await validateCredentials(
            {
                id: githubPersonalStars.id,
                criteria: {
                    minStars: 100
                }
            },
            {
                profile: {},
                accessTokens: { github: "token" }
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubPersonalStars.id,
                    criteria: {}
                },
                {
                    profile: {},
                    accessTokens: { github: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minStars' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubPersonalStars.id,
                    criteria: {
                        repository: "hello-worId",
                        minStars: 200
                    }
                },
                {
                    profile: {},
                    accessTokens: { github: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'repository' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubPersonalStars.id,
                    criteria: {
                        minStars: "hello"
                    }
                },
                {
                    profile: {},
                    accessTokens: { github: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minStars' is not a number"
        )
    })
})
