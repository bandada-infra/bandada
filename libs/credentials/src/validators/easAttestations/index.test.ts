import { validateCredentials } from "../.."
import easAttestations from "./index"

jest.mock("../..", () => ({
    EASNetworks: { ETHEREUM_SEPOLIA: "sepolia" },
    validateCredentials: jest.fn()
}))

describe("EASAttestations", () => {
    it("Should return true if an account has greater than or equal to 3 attestations", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => true)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 3,
                    network: "sepolia",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c"
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should return true if the given optional criterias are satisfied", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => true)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 1,
                    network: "sepolia",
                    attester: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
                    revocable: true,
                    revoked: false,
                    isOffchain: false
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should return false if the attester optional criteria doesn't match", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => false)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 1,
                    network: "sepolia",
                    attester: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d4",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
                    revocable: true,
                    revoked: false,
                    isOffchain: false
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d4"
            }
        )

        expect(result).toBeFalsy()
    })

    it("Should return false if the schemaId optional criteria doesn't match", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => false)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 1,
                    network: "sepolia",
                    attester: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5d",
                    revocable: true,
                    revoked: false,
                    isOffchain: false
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
            }
        )

        expect(result).toBeFalsy()
    })

    it("Should return false if the revocable optional criteria doesn't match", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => false)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 1,
                    network: "sepolia",
                    attester: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
                    revocable: false,
                    revoked: false,
                    isOffchain: false
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
            }
        )

        expect(result).toBeFalsy()
    })

    it("Should return false if the revoked optional criteria doesn't match", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => false)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 1,
                    network: "sepolia",
                    attester: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
                    revocable: true,
                    revoked: true,
                    isOffchain: false
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
            }
        )

        expect(result).toBeFalsy()
    })

    it("Should return false if the isOffchain optional criteria doesn't match", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => false)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 1,
                    network: "sepolia",
                    attester: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
                    revocable: true,
                    revoked: false,
                    isOffchain: true
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
            }
        )

        expect(result).toBeFalsy()
    })

    it("Should return false if an account has less than 3 attestations", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => false)

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 3,
                    network: "sepolia",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c"
                }
            },
            {
                address: "0x"
            }
        )

        expect(result).toBeFalsy()
    })

    it("Should throw an error if a mandatory criteria parameter is missing", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => {
            throw new Error("Parameter 'minAttestations' has not been defined")
        })

        const fun = () =>
            validateCredentials(
                {
                    id: easAttestations.id,
                    criteria: {}
                },
                {
                    address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minAttestations' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => {
            throw new Error(
                "Parameter 'test' should not be part of the criteria"
            )
        })

        const fun = () =>
            validateCredentials(
                {
                    id: easAttestations.id,
                    criteria: {
                        minAttestations: 1,
                        network: "sepolia",
                        schemaId:
                            "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
                        test: 123
                    }
                },
                {
                    address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'test' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => {
            throw new Error("Parameter 'minAttestations' is not a number")
        })

        const fun = () =>
            validateCredentials(
                {
                    id: easAttestations.id,
                    criteria: {
                        minAttestations: "1",
                        network: "sepolia",
                        schemaId:
                            "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c"
                    }
                },
                {
                    address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minAttestations' is not a number"
        )
    })

    it("Should throw invalid network error if the network is invalid", async () => {
        ;(validateCredentials as any).mockImplementationOnce(async () => {
            throw new Error("Invalid network")
        })

        const fun = validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 1,
                    network: "test",
                    attester: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3",
                    schemaId:
                        "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
                    revocable: true,
                    revoked: false,
                    isOffchain: false
                }
            },
            {
                address: "0x63A35A52c0ac206108EBbf559E4C7109dAd281d3"
            }
        )

        await expect(fun).rejects.toThrow("Invalid network")
    })
})
