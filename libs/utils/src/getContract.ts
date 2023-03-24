/* istanbul ignore file */

import { Signer } from "@ethersproject/abstract-signer"
import { Contract } from "@ethersproject/contracts"
import { Provider } from "@ethersproject/providers"
import { getContractAddresses } from "./contractAddresses"
import { abi as SemaphoreABI } from "./contractArtifacts/Semaphore.json"
import { abi as BandadaABI } from "./contractArtifacts/Bandada.json"
import getProvider from "./getProvider"
import getWallet from "./getWallet"
import { ContractName, Network } from "./types"

export default function getContract(
    contractName: ContractName,
    network: Network,
    privateKeyOrSigner?: string | Signer,
    apiKey?: string
): Contract {
    let providerOrWallet: Provider | Signer

    if (privateKeyOrSigner) {
        if (typeof privateKeyOrSigner === "string") {
            providerOrWallet = getWallet(privateKeyOrSigner, network, apiKey)
        } else {
            providerOrWallet = privateKeyOrSigner
        }
    } else {
        providerOrWallet = getProvider(network, apiKey)
    }

    const contractAddress = getContractAddresses(network)[contractName]

    switch (contractName) {
        case "Bandada":
            return new Contract(contractAddress, BandadaABI, providerOrWallet)
        case "Semaphore":
            return new Contract(contractAddress, SemaphoreABI, providerOrWallet)
        default:
            throw new TypeError(`'${contractName}' contract does not exist`)
    }
}
