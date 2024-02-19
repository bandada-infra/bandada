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
            const { recipient } = context as EASContext

            const getAttestations = (context as EASContext).queryGraph

            const attestations = await getAttestations(`
                query {
                    attestations {
                        id                    
                        recipient
                    }
                }
            `)

            const recipientAttestations = attestations.filter(
                (attestation: any) => attestation.recipient === recipient
            )

            return recipientAttestations.length >= criteria.minAttestations
        }

        throw new Error("No recipient value found")
    }
}

export default validator
