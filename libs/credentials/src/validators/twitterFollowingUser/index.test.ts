import { testUtils, validateCredentials } from "../.."
import twitterFollowingUser from "./index"

describe("TwitterFollowingUser", () => {
    it("Should return true if a Twitter user follows another specific user", async () => {
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

        const result = await validateCredentials(
            {
                id: twitterFollowingUser.id,
                criteria: {
                    username: "world"
                }
            },
            {
                profile: { id: "123123" },
                accessTokens: { twitter: "token" }
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: twitterFollowingUser.id,
                    criteria: {}
                },
                {
                    profile: { id: "123123" },
                    accessTokens: { twitter: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'username' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: twitterFollowingUser.id,
                    criteria: {
                        username: "hello",
                        minTweets: 200
                    }
                },
                {
                    profile: { id: "123123" },
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
                    id: twitterFollowingUser.id,
                    criteria: {
                        username: 100
                    }
                },
                {
                    profile: { id: "123123" },
                    accessTokens: { twitter: "token" }
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'username' is not a string"
        )
    })
})
