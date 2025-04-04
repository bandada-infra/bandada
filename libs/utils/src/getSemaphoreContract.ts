/* istanbul ignore file */

import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractReceipt } from "@ethersproject/contracts";
import getContract from "./getContract";
import { Network } from "./types";

export class SemaphoreContract {
    private contract: Contract;

    constructor(contract: Contract) {
        this.contract = contract;
    }

    private async sendTransaction(method: string, ...args: any[]): Promise<ContractReceipt> {
        const transaction = await this.contract[method](...args);
        return transaction.wait(1);
    }

    async createGroup(admin: string): Promise<ContractReceipt> {
        return this.sendTransaction("createGroup(address)", admin);
    }

    async updateGroupAdmin(groupId: string, newAdmin: string): Promise<ContractReceipt> {
        return this.sendTransaction("updateGroupAdmin", groupId, newAdmin);
    }

    async addMember(groupId: string, member: string): Promise<ContractReceipt> {
        return this.sendTransaction("addMember", groupId, member);
    }

    async addMembers(groupId: string, members: string[]): Promise<ContractReceipt> {
        return this.sendTransaction("addMembers", groupId, members);
    }

    async removeMember(groupId: string, member: string, siblings: bigint[]): Promise<ContractReceipt> {
        return this.sendTransaction("removeMember", groupId, member, siblings);
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
    );

    return new SemaphoreContract(contract);
}
