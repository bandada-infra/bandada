/* istanbul ignore file */
import { ContractReceipt, utils } from "ethers"
import getSigner from "./getSigner"
import getContractInstance from "./getContractInstance"
import { Network } from "./types"

export async function updateGroups(
    updatedGroups: Map<string, any[]>,
    network: Network = process.env.NX_DEFAULT_NETWORK as Network
): Promise<ContractReceipt> {
    const signer = await getSigner(network)
    const contractInstance = getContractInstance("ZKGroups").connect(signer)

    const offchainGroups = []
    const groupNames = []

    for (const [name, merkleTreeInfo] of updatedGroups) {
        groupNames.push(utils.formatBytes32String(name))
        offchainGroups.push({
            merkleTreeRoot: merkleTreeInfo[0],
            merkleTreeDepth: merkleTreeInfo[1]
        })
    }

    const transaction = await contractInstance["updateGroups"](
        groupNames,
        offchainGroups
    )

    return transaction.wait(1)
}
