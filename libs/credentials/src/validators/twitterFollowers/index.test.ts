import { testUtils, validateCredentials } from "../.."
import twitterFollowers from "./index"

describe("TwitterFollowers", () => {
    it("Should return true if a Twitter user has more than 100 followers", async () => {
        testUtils.mockAPIOnce({
            data: {
                public_metrics: {
                    followers_count: 110
                }
            }
        })

        const result = await validateCredentials(
            {
                id: twitterFollowers.id,
                criteria: {
                    minFollowers: 100
                }
            },
            {
                profile: {},
                accessTokens: { twitter: "token" }
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: twitterFollowers.id,
                    criteria: {}
                },
                {
                    profile: {},
                    accessTokens: { twitter: "token" }
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
                    id: twitterFollowers.id,
                    criteria: {
                        minFollowers: 100,
                        minTweets: 200
                    }
                },
                {
                    profile: {},
                    accessTokens: { twitter: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minTweets' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: twitterFollowers.id,
                    criteria: {
                        minFollowers: "100"
                    }
                },
                {
                    profile: {},
                    accessTokens: { twitter: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' is not a number"
        )
    })
})
