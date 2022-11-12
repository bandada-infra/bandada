import { ContractReceipt, utils } from "ethers"
import getSigner from "../../getSigner"
import getContractInstance from "../getContractInstance"

export default async function updateOffchainGroups(
    updatedGroups: Map<string, any[]>
): Promise<ContractReceipt> {
    const signer = await getSigner()
    const contractInstance = getContractInstance("ZKGroups").connect(signer)

    const offchainGroups = []

    for (const [name, merkleTreeInfo] of updatedGroups) {
        offchainGroups.push({
            name: utils.formatBytes32String(name),
            merkleTreeRoot: merkleTreeInfo[0],
            merkleTreeDepth: merkleTreeInfo[1]
        })
    }

    const transaction = await contractInstance.updateOffchainGroups(
        offchainGroups
    )
    return transaction.wait(1)
}
