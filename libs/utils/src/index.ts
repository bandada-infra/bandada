import CONTRACT_ADDRESSES, { getContractAddresses } from "./contract-addresses"
import { abi as SemaphoreABI } from "./contract-artifacts/Semaphore.json"
import { abi as ZKGroupsABI } from "./contract-artifacts/ZKGroups.json"
import getContract from "./getContract"
import getProvider from "./getProvider"
import getSemaphoreContract, { SemaphoreContract } from "./getSemaphoreContract"
import getWallet from "./getWallet"
import getZKGroupsContract, { ZKGroupsContract } from "./getZKGroupsContract"
import request from "./request"
import shortenAddress from "./shortenAddress"

export * from "./types/index"
export {
    request,
    shortenAddress,
    getProvider,
    getContract,
    getSemaphoreContract,
    SemaphoreContract,
    getZKGroupsContract,
    ZKGroupsContract,
    getWallet,
    CONTRACT_ADDRESSES,
    getContractAddresses,
    SemaphoreABI,
    ZKGroupsABI
}
