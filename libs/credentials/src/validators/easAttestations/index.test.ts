import { validateCredentials } from "../.."
import easAttestations from "./index"

describe("EASAttestations", () => {
    const queryGraphMocked = {
        queryGraph: jest.fn()
    }

    it("Should return true if an account has greater than or equal to 3 attestations", async () => {
        queryGraphMocked.queryGraph.mockReturnValue([
            {
                id: "0x52561c95029d9f2335839ddc96a69ee9737a18e2a781e64659b7bd645ccb8efc",
                recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae8"
            },
            {
                id: "0xee06a022c7d55f67bac213d6b2cd384a899ef79a57f1f5f148e45c313b4fdebe",
                recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae8"
            },
            {
                id: "0xfbc0f1aac4379c18fa9a5b6493825234a8ca82a2a296148465d150c2e64c6202",
                recipient: "0x0000000000000000000000000000000000000000"
            },
            {
                id: "0x227510204bcfe7b543388b82c6e02aafe7b0d0a20e4f159794e8121611aa601b",
                recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae8"
            }
        ])

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 3
                }
            },
            {
                recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae8",
                queryGraph: queryGraphMocked.queryGraph
            }
        )

        expect(result).toBeTruthy()
    })

    it("Should return false if an account has less than 3 attestations", async () => {
        queryGraphMocked.queryGraph.mockReturnValue([
            {
                id: "0x52561c95029d9f2335839ddc96a69ee9737a18e2a781e64659b7bd645ccb8efc",
                recipient: "0x0000000000000000000000000000000000000000"
            },
            {
                id: "0xee06a022c7d55f67bac213d6b2cd384a899ef79a57f1f5f148e45c313b4fdebe",
                recipient: "0x0000000000000000000000000000000000000000"
            },
            {
                id: "0xfbc0f1aac4379c18fa9a5b6493825234a8ca82a2a296148465d150c2e64c6202",
                recipient: "0x0000000000000000000000000000000000000000"
            },
            {
                id: "0x227510204bcfe7b543388b82c6e02aafe7b0d0a20e4f159794e8121611aa601b",
                recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae8"
            }
        ])

        const result = await validateCredentials(
            {
                id: easAttestations.id,
                criteria: {
                    minAttestations: 3
                }
            },
            {
                recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae8",
                queryGraph: queryGraphMocked.queryGraph
            }
        )

        expect(result).toBeFalsy()
    })

    it("Should throw an error if a criteria parameter is missing", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: easAttestations.id,
                    criteria: {}
                },
                {
                    recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae9",
                    queryGraph: queryGraphMocked.queryGraph
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minAttestations' has not been defined"
        )
    })

    it("Should throw an error if a criteria parameter should not exist", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: easAttestations.id,
                    criteria: {
                        minAttestations: 1,
                        test: 123
                    }
                },
                {
                    recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae9",
                    queryGraph: queryGraphMocked.queryGraph
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'test' should not be part of the criteria"
        )
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateCredentials(
                {
                    id: easAttestations.id,
                    criteria: {
                        minAttestations: "1"
                    }
                },
                {
                    recipient: "0x9aB3971e1b065701C72C5f3cAFbF33118dC51ae9",
                    queryGraph: queryGraphMocked.queryGraph
                }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minAttestations' is not a number"
        )
    })
})
