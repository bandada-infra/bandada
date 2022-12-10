/* istanbul ignore file */
import { ContractReceipt, Signer } from "ethers"
import { toUtf8Bytes, concat, hexlify } from "ethers/lib/utils"
import getContractInstance from "../../getContractInstance"
import { HashZero } from "@ethersproject/constants"
import { Bytes31 } from "soltypes"

export function formatUint248String(groupName: string): string {
    const uint8_arr = toUtf8Bytes(groupName)

    if (uint8_arr.length > 30) {
        throw new Error(
            "groupName should be less than 31 bytes - To not exceed the snake field"
        )
    }

    const bytes = new Bytes31(
        hexlify(concat([uint8_arr, HashZero]).slice(0, 31))
    )

    return bytes.toUint().toString()
}

export async function createGroup(
    signer: Signer,
    groupName: string,
    merkleTreeDepth: number
): Promise<any> {
    const admin = signer
    const groupId = formatUint248String(groupName)
    const contractInstance = getContractInstance("Semaphore").connect(admin)

    const transaction = await contractInstance[
        "createGroup(uint256,uint256,uint256,address)"
    ](groupId, merkleTreeDepth, 0, admin.getAddress())

    return transaction.wait(1)
}

export async function updateGroupAdmin(
    signer: Signer,
    groupName: string,
    newAdmin: string
): Promise<ContractReceipt> {
    const admin = signer
    const groupId = formatUint248String(groupName)
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
    const groupId = formatUint248String(groupName)
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
    const groupId = formatUint248String(groupName)
    const contractInstance = getContractInstance("Semaphore").connect(admin)

    const transaction = await contractInstance["addMembers(uint256,uint256[])"](
        groupId,
        members
    )

    return transaction.wait(1)
}
