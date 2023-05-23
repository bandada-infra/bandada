import validateReputation from "../validateReputation"

describe("GithubFollowers", () => {
    it("Should return true if a Github user has more than 100 followers", async () => {
        const result = validateReputation(
            {
                type: "GITHUB_FOLLOWERS",
                parameters: {
                    minFollowers: 100
                }
            },
            { githubAccessToken: "" }
        )

        expect(result).toBeTruthy()
    })
})
