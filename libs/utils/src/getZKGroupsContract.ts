/* istanbul ignore file */

import { Signer } from "@ethersproject/abstract-signer"
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
    privateKeyOrSigner?: string | Signer,
    apiKey?: string
): ZKGroupsContract {
    const contract = getContract(
        "ZKGroups",
        network,
        privateKeyOrSigner,
        apiKey
    )

    return new ZKGroupsContract(contract)
}
