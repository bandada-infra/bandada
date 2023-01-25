/* istanbul ignore file */
import { BigNumber, ContractReceipt, Signer } from "ethers"
import { formatBytes32String } from "ethers/lib/utils"
import getContractInstance from "./getContractInstance"

export function formatUint256String(text: string): BigInt {
    return BigNumber.from(formatBytes32String(text)).toBigInt()
}

export async function createGroup(
    signer: Signer,
    groupName: string,
    merkleTreeDepth: number
): Promise<any> {
    const admin = signer
    const groupId = formatUint256String(groupName)
    const contractInstance = getContractInstance("Semaphore").connect(admin)

    const transaction = await contractInstance[
        "createGroup(uint256,uint256,address)"
    ](groupId, merkleTreeDepth, await admin.getAddress())

    return transaction.wait(1)
}

export async function updateGroupAdmin(
    signer: Signer,
    groupName: string,
    newAdmin: string
): Promise<ContractReceipt> {
    const admin = signer
    const groupId = formatUint256String(groupName)
    const contractInstance = getContractInstance("Semaphore").connect(admin)

    const transaction = await contractInstance[
        "updateGroupAdmin(uint256,address)"
    ](groupId, newAdmin)

    return transaction.wait(1)
}

export async function addMember(
    signer: Signer,
    groupName: string,
    member: string
): Promise<ContractReceipt> {
    const admin = signer
    const groupId = formatUint256String(groupName)
    const contractInstance = getContractInstance("Semaphore").connect(admin)

    const transaction = await contractInstance["addMember(uint256,uint256)"](
        groupId,
        member
    )

    return transaction.wait(1)
}

export async function addMembers(
    signer: Signer,
    groupName: string,
    members: string[]
): Promise<ContractReceipt> {
    const admin = signer
    const groupId = formatUint256String(groupName)
    const contractInstance = getContractInstance("Semaphore").connect(admin)

    const transaction = await contractInstance["addMembers(uint256,uint256[])"](
        groupId,
        members
    )

    return transaction.wait(1)
}
