import { ethers } from "ethers"
import type { BigNumberish } from "ethers"
import { BlockchainProvider } from "../.."
import getJsonRpcProvider from "../../getJsonRpcProvider"

const provider: BlockchainProvider = {
    name: "blockchain",

    async getAddress(
        message: string,
        signature: string
    ): Promise<BigNumberish> {
        const address = await ethers.verifyMessage(message, signature)

        return address
    },

    async getJsonRpcProvider(url: string): Promise<any> {
        const jsonRpcProvider = getJsonRpcProvider(url)

        return jsonRpcProvider
    }
}

export default provider
