import shortenAddress from "./shortenAddress"

describe("Utils", () => {
    describe("# shortenAddress", () => {
        it("Should shorten an Ethereum address", () => {
            const address = shortenAddress(
                "0x1234567890123456789012345678901234567890"
            )

            expect(address).toBe("0x1234...7890")
        })
    })
})
