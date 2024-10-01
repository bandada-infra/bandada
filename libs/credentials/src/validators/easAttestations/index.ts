import { Context, Validator } from "../.."
import provider from "../../providers/eas"

export type Criteria = {
    minAttestations: number
    recipient: string
    attester?: string
    schemaId?: string
    revocable?: boolean
    revoked?: boolean
    isOffchain?: boolean
}

const validator: Validator = {
    id: "EAS_ATTESTATIONS",

    criteriaABI: {
        minAttestations: {
            type: "number",
            optional: false
        },
        recipient: {
            type: "string",
            optional: false
        },
        attester: {
            type: "string",
            optional: true
        },
        schemaId: {
            type: "string",
            optional: true
        },
        revocable: {
            type: "boolean",
            optional: true
        },
        revoked: {
            type: "boolean",
            optional: true
        },
        isOffchain: {
            type: "boolean",
            optional: true
        }
    },

    /**
     * It checks if a user has greater than or equal to 'minAttestations' attestations.
     * @param criteria The criteria used to check user's credentials.
     * @param context Context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context: Context) {
        if ("network" in context) {
            const {
                recipient,
                attester,
                schemaId,
                revocable,
                revoked,
                isOffchain
            } = criteria

            const query = `query {
                attestations(where: {
                    recipient: {
                        equals: "${criteria.recipient}"
                    },
                    attester: {
                        equals: "${context.address}"
                    }
                }) {
                    recipient
                    attester
                    revocable
                    revoked
                    schemaId
                    isOffchain
                }
            }`

            const getAttestations = await provider.queryGraph(
                context.network,
                query
            )

            const filteredAttestations =
                getAttestations.data.attestations.filter((attestation: any) => {
                    // Criteria checks.
                    if (attestation.recipient !== recipient) return false

                    if (
                        attester !== undefined &&
                        attestation.attester !== attester
                    )
                        return false
                    if (
                        schemaId !== undefined &&
                        attestation.schemaId !== schemaId
                    )
                        return false
                    if (
                        revocable !== undefined &&
                        attestation.revocable !== revocable
                    )
                        return false
                    if (
                        revoked !== undefined &&
                        attestation.revoked !== revoked
                    )
                        return false
                    if (
                        isOffchain !== undefined &&
                        attestation.isOffchain !== isOffchain
                    )
                        return false

                    return true
                })

            return filteredAttestations.length >= criteria.minAttestations
        }

        throw new Error("No recipient value found")
    }
}

export default validator
