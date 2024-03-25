import CONTRACT_ADDRESSES, { getContractAddresses } from "./contractAddresses"
import { abi as SemaphoreABI } from "./contractArtifacts/Semaphore.json"
import { abi as BandadaABI } from "./contractArtifacts/Bandada.json"
import getContract from "./getContract"
import getProvider from "./getProvider"
import getSemaphoreContract, { SemaphoreContract } from "./getSemaphoreContract"
import getWallet from "./getWallet"
import getBandadaContract, { BandadaContract } from "./getBandadaContract"
import request from "./request"
import shortenAddress from "./shortenAddress"
import { blockchainCredentialNetworks } from "./getSupportedNetworks"

export * from "./types/index"
export {
    request,
    shortenAddress,
    getProvider,
    getContract,
    getSemaphoreContract,
    SemaphoreContract,
    getBandadaContract,
    BandadaContract,
    getWallet,
    CONTRACT_ADDRESSES,
    getContractAddresses,
    SemaphoreABI,
    BandadaABI,
    blockchainCredentialNetworks
}
