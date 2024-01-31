import { BlockchainContext, Validator } from "../.."

export type Criteria = {
    minTransactions: number
}

const validator: Validator = {
    id: "BLOCKCHAIN_TRANSACTIONS",

    criteriaABI: {
        minTransactions: "number"
    },

    /**
     * It checks if a user has greater than or equal to 'minTransactions' transactions.
     * @param criteria The criteria used to check user's credentials.
     * @param context Context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context) {
        if ("address" in context) {
            const transactionCount = await (
                context as BlockchainContext
            ).jsonRpcProvider.getTransactionCount(
                (context as BlockchainContext).address,
                (context as BlockchainContext).blockNumber
            )
            return transactionCount >= criteria.minTransactions
        }
        throw new Error("No address value found")
    }
}

export default validator
