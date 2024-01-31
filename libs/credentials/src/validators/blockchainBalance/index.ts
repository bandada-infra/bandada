import { BigNumber } from "ethers"
import { BlockchainContext, Validator } from "../.."

export type Criteria = {
    minBalance: string
}

const validator: Validator = {
    id: "BLOCKCHAIN_BALANCE",

    criteriaABI: {
        minBalance: "string"
    },

    /**
     * It checks if a user has greater than or equal to 'minBalance' balance.
     * @param criteria The criteria used to check user's credentials.
     * @param context Context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context) {
        if ("address" in context) {
            const balance = await (
                context as BlockchainContext
            ).jsonRpcProvider.getBalance(
                (context as BlockchainContext).address,
                (context as BlockchainContext).blockNumber
            )
            return balance >= BigNumber.from(criteria.minBalance)
        }
        throw new Error("No address value found")
    }
}

export default validator
