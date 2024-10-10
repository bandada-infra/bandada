import {
    blockchainCredentialSupportedNetworks,
    easCredentialSupportedNetworks
} from "./getSupportedNetworks"
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

    describe("# blockchainCredentialSupportedNetworks", () => {
        it("Should return a list of blockchain credential supported network", () => {
            const networks = blockchainCredentialSupportedNetworks

            expect(networks).toHaveLength(
                blockchainCredentialSupportedNetworks.length
            )
        })

        it("Should return a blockchain credential supported network", () => {
            const expected = {
                id: "sepolia",
                name: "Sepolia"
            }
            const id = blockchainCredentialSupportedNetworks.find(
                (i) => i.id === expected.id
            )
            const name = blockchainCredentialSupportedNetworks.find(
                (i) => i.name === expected.name
            )

            expect(id).toMatchObject(expected)
            expect(name).toMatchObject(expected)
        })
    })

    describe("# easCredentialSupportedNetworks", () => {
        it("Should return a list of EAS attestations credential supported network", () => {
            const networks = easCredentialSupportedNetworks

            expect(networks).toHaveLength(easCredentialSupportedNetworks.length)
        })

        it("Should return a blockchain credential supported network", () => {
            const expected = {
                id: "sepolia",
                name: "Ethereum (Sepolia)"
            }
            const id = easCredentialSupportedNetworks.find(
                (i) => i.id === expected.id
            )
            const name = easCredentialSupportedNetworks.find(
                (i) => i.name === expected.name
            )

            expect(id).toMatchObject(expected)
            expect(name).toMatchObject(expected)
        })
    })
})
