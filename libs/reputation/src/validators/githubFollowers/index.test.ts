import { testUtils, validateReputation } from "../.."
import githubFollowers from "./index"

global.fetch = jest.fn()

describe("GithubFollowers", () => {
    it("Should return true if a Github user has more than 100 followers", async () => {
        testUtils.mockAPIOnce({
            followers: 110
        })

        const result = await validateReputation(
            {
                name: githubFollowers.name,
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
                    name: githubFollowers.name,
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
                    name: githubFollowers.name,
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
                    name: githubFollowers.name,
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
