import { addValidator, testUtils, validateReputation } from "../.."
import githubPersonalStars from "./index"

global.fetch = jest.fn()

describe("GithubPersonalStars", () => {
    beforeAll(() => {
        addValidator(githubPersonalStars)
    })

    it("Should return true if a Github user has more than 100 stars in their personal repositories", async () => {
        testUtils.mockAPIOnce(
            Array.from(Array(100).keys()).map(() => ({ stargazers_count: 0 }))
        )
        testUtils.mockAPIOnce(
            Array.from(Array(20).keys()).map(() => ({ stargazers_count: 10 }))
        )

        const result = await validateReputation(
            {
                name: githubPersonalStars.name,
                criteria: {
                    minStars: 100
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
                    name: githubPersonalStars.name,
                    criteria: {}
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minStars' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: githubPersonalStars.name,
                    criteria: {
                        repository: "hello-worId",
                        minStars: 200
                    }
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'repository' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: githubPersonalStars.name,
                    criteria: {
                        minStars: "hello"
                    }
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minStars' is not a number"
        )
    })
})
