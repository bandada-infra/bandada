import { mapGroupToResponseDTO } from "./groups.utils"

describe("Groups utils", () => {
    describe("# mapGroupToResponseDTO", () => {
        it("Should map the group data", async () => {
            const group = {
                members: [
                    {
                        id: 1
                    }
                ]
            }

            const { members } = mapGroupToResponseDTO(group as any)

            expect(members).toHaveLength(1)
            expect(members[0]).toBe(1)
        })

        it("Should map the group members, even if there are not members", async () => {
            const { members } = mapGroupToResponseDTO({} as any)

            expect(members).toHaveLength(0)
        })

        it("Should map the group data with api keys if specified", async () => {
            const { apiKey, apiEnabled } = mapGroupToResponseDTO(
                { apiEnabled: true, apiKey: "123" } as any,
                true
            )

            expect(apiEnabled).toBeTruthy()
            expect(apiKey).toBe("123")
        })
    })
})
