/* istanbul ignore file */
import { TransactionReceipt } from "ethers"
import getContractInstance from "./getContractInstance"
import getSigner from "./getSigner"
import { Network } from "./types"

export type Group = {
    id: BigInt
    fingerprint: BigInt
}

export async function updateGroups(
    groups: Group[],
    network: Network = process.env.NX_DEFAULT_NETWORK as Network
): Promise<TransactionReceipt> {
    const signer = await getSigner(network)
    const contractInstance = getContractInstance("ZKGroups").connect(
        signer
    ) as any

    const transaction = await contractInstance.updateGroups(groups)

    return transaction.wait(1)
}
