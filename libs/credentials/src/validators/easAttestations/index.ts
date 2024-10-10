import { Context, EASNetworks, Validator } from "../.."
import provider from "../../providers/eas"

export type Criteria = {
    minAttestations: number
    network: string
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
        network: {
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
        if (
            "address" in context &&
            criteria.minAttestations &&
            criteria.network
        ) {
            const {
                minAttestations,
                network,
                attester,
                schemaId,
                revocable,
                revoked,
                isOffchain
            } = criteria

            let whereConditions = `recipient: { equals: "${context.address}" }`

            if (attester !== undefined && attester !== null) {
                whereConditions += `attester: { equals: "${attester}" },`
            }

            if (schemaId !== undefined && schemaId !== null) {
                whereConditions += `schemaId: { equals: "${schemaId}" },`
            }

            if (revocable !== undefined && revocable !== null) {
                whereConditions += `revocable: { equals: ${revocable} },`
            }

            if (revoked !== undefined && revoked !== null) {
                whereConditions += `revoked: { equals: ${revoked} },`
            }

            if (isOffchain !== undefined && isOffchain !== null) {
                whereConditions += `isOffchain: { equals: ${isOffchain} },`
            }

            const query = `query {
                attestations(where: { ${whereConditions} }) {
                    recipient
                    attester
                    schemaId
                    revocable
                    revoked
                    isOffchain
                }
            }`

            const attestations = await provider.queryGraph(
                network as EASNetworks,
                query
            )

            return attestations.data.attestations.length >= minAttestations
        }

        throw new Error("No address value found")
    }
}

export default validator
