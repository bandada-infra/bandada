import addValidator from "../addValidator"
import * as testUtils from "../testUtils"
import validateReputation from "../validateReputation"
import twitterFollowers from "./twitterFollowers"

global.fetch = jest.fn()

describe("TwitterFollowers", () => {
    beforeAll(() => {
        addValidator(twitterFollowers)
    })

    it("Should return true if a Twitter user has more than 100 followers", async () => {
        testUtils.mockAPIOnce({
            data: {
                public_metrics: {
                    followers_count: 110
                }
            }
        })

        const result = await validateReputation(
            {
                name: "TWITTER_FOLLOWERS",
                criteria: {
                    minFollowers: 100
                }
            },
            {
                twitterAccessToken: "token"
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "TWITTER_FOLLOWERS",
                    criteria: {}
                },
                { twitterAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "TWITTER_FOLLOWERS",
                    criteria: {
                        minFollowers: 100,
                        minTweets: 200
                    }
                },
                { twitterAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minTweets' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "TWITTER_FOLLOWERS",
                    criteria: {
                        minFollowers: "100"
                    }
                },
                { twitterAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' is not a number"
        )
    })
})
