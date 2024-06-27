import { utils } from "ethers"
import { BlockchainContext, Validator } from "../.."

export type Criteria = {
    minBalance: string
    network: string
    blockNumber?: number
}

const validator: Validator = {
    id: "BLOCKCHAIN_BALANCE",

    criteriaABI: {
        minBalance: {
            type: "string",
            optional: false
        },
        network: {
            type: "string",
            optional: false
        },
        blockNumber: {
            type: "number",
            optional: true
        }
    },

    /**
     * It checks if a user has a balance greater than or equal to 'minBalance'.
     * @param criteria The criteria used to check user's credentials.
     * @param context Context variables.
     * @returns True if the user meets the criteria.
     */
    async validate(criteria: Criteria, context) {
        if ("address" in context) {
            const blockNumber =
                criteria.blockNumber !== undefined
                    ? criteria.blockNumber
                    : undefined

            const balanceWei = await (
                context as BlockchainContext
            ).jsonRpcProvider.getBalance(
                (context as BlockchainContext).address,
                blockNumber
            )

            const balanceETH = utils.formatEther(balanceWei)
            
            return parseFloat(balanceETH) >= parseFloat(criteria.minBalance)
        }
        throw new Error("No address value found")
    }
}

export default validator
