import { Contract, ContractReceipt } from "@ethersproject/contracts"
import getContract from "./getContract"
import { Network, OnchainZKGroup } from "./types"

export class ZKGroupsContract {
    private contract: Contract

    constructor(contract: Contract) {
        this.contract = contract
    }

    async updateGroups(groups: OnchainZKGroup[]): Promise<ContractReceipt> {
        const transaction = await this.contract.updateGroups(groups)

        return transaction.wait(1)
    }
}

export default function getZKGroupsContract(
    network: Network,
    privateKey: string
): ZKGroupsContract {
    const contract = getContract("ZKGroups", network, privateKey)

    return new ZKGroupsContract(contract)
}
