/* istanbul ignore file */
import { ContractReceipt, utils } from "ethers"
import getSigner from "../getBackendSigner"
import getContractInstance from "../getContractInstance"

export async function updateOffchainGroups(
    updatedGroups: Map<string, any[]>
): Promise<ContractReceipt> {
    const signer = await getSigner()
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
