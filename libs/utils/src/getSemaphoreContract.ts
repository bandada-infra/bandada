/* istanbul ignore file */

import { Signer } from "@ethersproject/abstract-signer"
import { Contract, ContractReceipt } from "@ethersproject/contracts"
import { formatBytes32String } from "@ethersproject/strings"
import getContract from "./getContract"
import { Network } from "./types"

export class SemaphoreContract {
    private contract: Contract

    constructor(contract: Contract) {
        this.contract = contract
    }

    async createGroup(
        groupName: string,
        merkleTreeDepth: number,
        admin: string
    ): Promise<ContractReceipt> {
        const groupId = BigInt(formatBytes32String(groupName))

        const transaction = await this.contract[
            "createGroup(uint256,uint256,address)"
        ](groupId, merkleTreeDepth, admin)

        return transaction.wait(1)
    }

    async updateGroupAdmin(
        groupName: string,
        newAdmin: string
    ): Promise<ContractReceipt> {
        const groupId = BigInt(formatBytes32String(groupName))

        const transaction = await this.contract.updateGroupAdmin(
            groupId,
            newAdmin
        )

        return transaction.wait(1)
    }

    async addMember(
        groupName: string,
        member: string
    ): Promise<ContractReceipt> {
        const groupId = BigInt(formatBytes32String(groupName))

        const transaction = await this.contract.addMember(groupId, member)

        return transaction.wait(1)
    }

    async addMembers(
        groupName: string,
        members: string[]
    ): Promise<ContractReceipt> {
        const groupId = BigInt(formatBytes32String(groupName))

        const transaction = await this.contract.addMembers(groupId, members)

        return transaction.wait(1)
    }
}

export default function getSemaphoreContract(
    network: Network,
    privateKeyOrSigner?: string | Signer,
    apiKey?: string
): SemaphoreContract {
    const contract = getContract(
        "Semaphore",
        network,
        privateKeyOrSigner,
        apiKey
    )

    return new SemaphoreContract(contract)
}
