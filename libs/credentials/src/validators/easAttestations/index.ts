import { Context, EASContext, Validator } from "../.."

export type Criteria = {
    minAttestations: number
}

const validator: Validator = {
    id: "EAS_ATTESTATIONS",

    criteriaABI: {
        minAttestations: "number"
    },

    /**
     * It checks if a user has greater than or equal to 'minAttestations' attestations.
     * @param criteria The criteria used to check user's credentials.
     * @param context Context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context: Context) {
        if ("recipient" in context) {
            const {
                recipient,
                attester,
                schemaId,
                revocable,
                revoked,
                isOffchain
            } = context as EASContext
            const getAttestations = (context as EASContext).queryGraph

            const attestations = await getAttestations(`
                query {
                    attestations {
                        recipient
                        attester
                        revocable
                        revoked
                        schemaId
                        isOffchain
                    }
                }
            `)

            const filteredAttestations = attestations.filter(
                (attestation: any) => {
                    // Mandatory recipient check.
                    if (attestation.recipient !== recipient) return false

                    // Optional criteria checks.
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
                }
            )

            return filteredAttestations.length >= criteria.minAttestations
        }

        throw new Error("No recipient value found")
    }
}

export default validator
