import addValidator from "../addValidator"
import validateReputation from "../validateReputation"
import githubFollowers from "./githubFollowers"

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                followers: 110
            })
    })
) as any

describe("GithubFollowers", () => {
    beforeAll(() => {
        addValidator(githubFollowers)
    })

    it("Should return true if a Github user has more than 100 followers", async () => {
        const result = await validateReputation(
            {
                name: "GITHUB_FOLLOWERS",
                criteria: {
                    minFollowers: 100
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
                    name: "GITHUB_FOLLOWERS",
                    criteria: {}
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "GITHUB_FOLLOWERS",
                    criteria: {
                        minFollowers: 100,
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
                    name: "GITHUB_FOLLOWERS",
                    criteria: {
                        minFollowers: "100"
                    }
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' is not a number"
        )
    })
})