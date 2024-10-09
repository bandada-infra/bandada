import { Context, Validator } from "../.."
import provider from "../../providers/eas"

export type Criteria = {
    minAttestations: number
    schemaId?: string
    attester?: string
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
                minAttestations,
                attester,
                schemaId,
                revocable,
                revoked,
                isOffchain
            } = criteria

            const query = `query {
                attestations(where: {                
                    recipient: {
                        equals: "${context.address}"
                    },
                    ${
                        attester !== undefined && attester !== null
                            ? `attester: { equals: "${attester}" },`
                            : ""
                    }
                    ${
                        schemaId !== undefined && schemaId !== null
                            ? `schemaId: { equals: "${schemaId}" },`
                            : ""
                    }
                    ${
                        revocable !== undefined && revocable !== null
                            ? `revocable: { equals: ${revocable} },`
                            : ""
                    }
                    ${
                        revoked !== undefined && revoked !== null
                            ? `revoked: { equals: ${revoked} },`
                            : ""
                    }
                    ${
                        isOffchain !== undefined && isOffchain !== null
                            ? `isOffchain: { equals: ${isOffchain} },`
                            : ""
                    }
                }) {
                    recipient
                    attester
                    schemaId
                    revocable
                    revoked
                    isOffchain
                }
            }`

            const attestations = await provider.queryGraph(
                context.network,
                query
            )

            return attestations.data.attestations.length >= minAttestations
        }

        throw new Error("No recipient value found")
    }
}

export default validator
