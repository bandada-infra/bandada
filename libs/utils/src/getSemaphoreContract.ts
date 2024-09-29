/* istanbul ignore file */

import { Signer } from "@ethersproject/abstract-signer"
import { Contract, ContractReceipt } from "@ethersproject/contracts"
import getContract from "./getContract"
import { Network } from "./types"

export class SemaphoreContract {
    private contract: Contract

    constructor(contract: Contract) {
        this.contract = contract
    }

    async createGroup(admin: string): Promise<ContractReceipt> {
        const transaction = await this.contract["createGroup(address)"](admin)

        return transaction.wait(1)
    }

    async updateGroupAdmin(
        groupId: string,
        newAdmin: string
    ): Promise<ContractReceipt> {
        const transaction = await this.contract.updateGroupAdmin(
            groupId,
            newAdmin
        )

        return transaction.wait(1)
    }

    async addMember(groupId: string, member: string): Promise<ContractReceipt> {
        const transaction = await this.contract.addMember(groupId, member)

        return transaction.wait(1)
    }

    async addMembers(
        groupId: string,
        members: string[]
    ): Promise<ContractReceipt> {
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
