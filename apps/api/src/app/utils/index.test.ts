import mapEntity from "./mapEntity"
import stringifyJSON from "./stringifyJSON"

describe("Utils", () => {
    describe("# mapEntity", () => {
        it("Should map a DB entity", async () => {
            const entity = mapEntity({ id: 1, a: 2 }) as any

            expect(entity.id).toBeUndefined()
            expect(Object.values(entity)).toHaveLength(1)
        })
    })

    describe("# stringifyJSON", () => {
        it("Should map a DB entity", async () => {
            const entity = JSON.parse(stringifyJSON({ a: 143234n, b: "a" }))

            expect(entity.a).toBe("143234")
        })
    })
})
