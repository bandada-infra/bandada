import { validateCredentials } from "../.."
import blockchainTransactions from "./index"

describe("BlockchainTransactions", () => {
    const jsonRpcProviderMocked = {
        getTransactionCount: jest.fn()
    }

    it("Should return true if an account has greater than or equal to 10 transactions", async () => {
        jsonRpcProviderMocked.getTransactionCount.mockReturnValue(12)

        const result = await validateCredentials(
            {
                id: blockchainTransactions.id,
                criteria: {
                    minTransactions: 10,
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

    it("Should return true if an account has greater than or equal to 10 transactions using the block number", async () => {
        jsonRpcProviderMocked.getTransactionCount.mockReturnValue(12)

        const result = await validateCredentials(
            {
                id: blockchainTransactions.id,
                criteria: {
                    minTransactions: 10,
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
                    id: blockchainTransactions.id,
                    criteria: {}
                },
                {
                    address: "0x",
                    jsonRpcProvider: undefined
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minTransactions' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: blockchainTransactions.id,
                    criteria: {
                        minTransactions: 100,
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
                    id: blockchainTransactions.id,
                    criteria: {
                        minTransactions: "100",
                        network: "sepolia"
                    }
                },
                {
                    address: "0x",
                    jsonRpcProvider: undefined
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minTransactions' is not a number"
        )
    })
})
