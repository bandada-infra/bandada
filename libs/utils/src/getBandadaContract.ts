/* istanbul ignore file */

import { Signer } from "@ethersproject/abstract-signer"
import { Contract, ContractReceipt } from "@ethersproject/contracts"
import getContract from "./getContract"
import { Network, OnchainBandadaGroup } from "./types"

export class BandadaContract {
    private contract: Contract

    constructor(contract: Contract) {
        this.contract = contract
    }

    async updateGroups(
        groups: OnchainBandadaGroup[]
    ): Promise<ContractReceipt> {
        const transaction = await this.contract.updateGroups(groups)

        return transaction.wait(1)
    }

    async getGroups(): Promise<OnchainBandadaGroup[]> {
        const filter = this.contract.filters.GroupUpdated()
        const events = await this.contract.queryFilter(filter)

        return events.map(({ args }: any) => ({
            id: args[0].toBigInt(),
            fingerprint: args[1].toBigInt()
        }))
    }

    async updateFingerprintDuration(
        groupId: BigInt,
        fingerprintDuration: BigInt
    ): Promise<ContractReceipt> {
        const transaction = await this.contract.updateFingerprintDuration(
            groupId,
            fingerprintDuration
        )

        return transaction.wait(1)
    }
}

export default function getBandadaContract(
    network: Network,
    privateKeyOrSigner?: string | Signer,
    apiKey?: string
): BandadaContract {
    const contract = getContract("Bandada", network, privateKeyOrSigner, apiKey)

    return new BandadaContract(contract)
}
