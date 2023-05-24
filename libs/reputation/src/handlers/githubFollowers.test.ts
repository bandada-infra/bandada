import validateReputation from "../validateReputation"

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                followers: 110
            })
    })
) as any

describe("GithubFollowers", () => {
    it("Should return true if a Github user has more than 100 followers", async () => {
        const result = await validateReputation(
            {
                type: "GITHUB_FOLLOWERS",
                parameters: {
                    minFollowers: 100
                }
            },
            { githubAccessToken: "token" }
        )

        expect(result).toBeTruthy()
    })
})
