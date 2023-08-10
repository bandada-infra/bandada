import { validateCredentials } from "../.."
import githubFollowers from "./index"

describe("GithubFollowers", () => {
    it("Should return true if a Github user has more than 100 followers", async () => {
        const result = await validateCredentials(
            {
                id: githubFollowers.id,
                criteria: {
                    minFollowers: 100
                }
            },
            {
                profile: { followers: 110 },
                accessTokens: {
                    github: "token"
                }
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubFollowers.id,
                    criteria: {}
                },
                {
                    profile: { followers: 110 },
                    accessTokens: {
                        github: "token"
                    }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: githubFollowers.id,
                    criteria: {
                        minFollowers: 100,
                        minStars: 200
                    }
                },
                {
                    profile: { followers: 110 },
                    accessTokens: {
                        github: "token"
                    }
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
                    id: githubFollowers.id,
                    criteria: {
                        minFollowers: "100"
                    }
                },
                {
                    profile: { followers: 110 },
                    accessTokens: {
                        github: "token"
                    }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' is not a number"
        )
    })
})
