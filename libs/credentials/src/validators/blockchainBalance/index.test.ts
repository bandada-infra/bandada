import { BigNumber } from "ethers"
import { validateCredentials } from "../.."
import blockchainBalance from "./index"

describe("BlockchainBalance", () => {
    const jsonRpcProviderMocked = {
        getBalance: jest.fn()
    }

    it("Should return true if an account has a balance greater than or equal to 10", async () => {
        jsonRpcProviderMocked.getBalance.mockReturnValue(BigNumber.from(12))

        const result = await validateCredentials(
            {
                id: blockchainBalance.id,
                criteria: {
                    minBalance: "10",
                    network: "sepolia"
                }
            },
            {
                address: "0x",
                jsonRpcProvider: jsonRpcProviderMocked
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should return true if an account has a balance greater than or equal to 10 using the block number", async () => {
        jsonRpcProviderMocked.getBalance.mockReturnValue(BigNumber.from(12))

        const result = await validateCredentials(
            {
                id: blockchainBalance.id,
                criteria: {
                    minBalance: "10",
                    network: "sepolia",
                    blockNumber: 4749638
                }
            },
            {
                address: "0x",
                jsonRpcProvider: jsonRpcProviderMocked
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: blockchainBalance.id,
                    criteria: {}
                },
                {
                    address: "0x",
                    jsonRpcProvider: undefined
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minBalance' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: blockchainBalance.id,
                    criteria: {
                        minBalance: "100",
                        network: "sepolia",
                        minStars: 200
                    }
                },
                {
                    address: "0x",
                    jsonRpcProvider: undefined
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minStars' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: blockchainBalance.id,
                    criteria: {
                        minBalance: 100,
                        network: "sepolia"
                    }
                },
                {
                    address: "0x",
                    jsonRpcProvider: undefined
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minBalance' is not a string"
        )
    })
})
