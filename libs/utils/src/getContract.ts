import { Signer } from "@ethersproject/abstract-signer"
import { Contract } from "@ethersproject/contracts"
import { Provider } from "@ethersproject/providers"
import { getContractAddresses } from "./contract-addresses"
import { abi as SemaphoreABI } from "./contract-artifacts/Semaphore.json"
import { abi as ZKGroupsABI } from "./contract-artifacts/ZKGroups.json"
import getProvider from "./getProvider"
import getWallet from "./getWallet"
import { ContractName, Network } from "./types"

export default function getContract(
    contractName: ContractName,
    network: Network,
    privateKeyOrSigner?: string | Signer
): Contract {
    let providerOrWallet: Provider | Signer

    if (privateKeyOrSigner) {
        if (typeof privateKeyOrSigner === "string") {
            providerOrWallet = getWallet(privateKeyOrSigner, network)
        } else {
            providerOrWallet = privateKeyOrSigner
        }
    } else {
        providerOrWallet = getProvider(network)
    }

    const contractAddress = getContractAddresses(network)[contractName]

    switch (contractName) {
        case "ZKGroups":
            return new Contract(contractAddress, ZKGroupsABI, providerOrWallet)
        case "Semaphore":
            return new Contract(contractAddress, SemaphoreABI, providerOrWallet)
        default:
            throw new TypeError(`'${contractName}' contract does not exist`)
    }
}
