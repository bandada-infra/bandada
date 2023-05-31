import { addValidator, testUtils, validateReputation } from "../.."
import twitterFollowingUser from "./index"

global.fetch = jest.fn()

describe("TwitterFollowingUser", () => {
    beforeAll(() => {
        addValidator(twitterFollowingUser)
    })

    it("Should return true if a Twitter user follows another specific user", async () => {
        testUtils.mockAPIOnce({
            data: {
                id: "123123"
            }
        })
        testUtils.mockAPIOnce({
            data: [
                {
                    username: "hello"
                },
                {
                    username: "world"
                }
            ]
        })

        const result = await validateReputation(
            {
                name: twitterFollowingUser.name,
                criteria: {
                    username: "world"
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
                    name: twitterFollowingUser.name,
                    criteria: {}
                },
                { twitterAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'username' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: twitterFollowingUser.name,
                    criteria: {
                        username: "hello",
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
                    name: twitterFollowingUser.name,
                    criteria: {
                        username: 100
                    }
                },
                { twitterAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'username' is not a string"
        )
    })
})
