import { ContractName, Network } from "./types"

const CONTRACT_ADDRESSES: { [K in Network]: { [Y in ContractName]: string } } =
    {
        localhost: {
            Semaphore: "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
            ZKGroups: "0xCfEB869F69431e42cdB54A4F4f105C19C080A601"
        },
        goerli: {
            Semaphore: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            ZKGroups: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
        }
    }

export function getContractAddresses(networkName: Network): {
    [Y in ContractName]: string
} {
    return CONTRACT_ADDRESSES[networkName]
}

export default CONTRACT_ADDRESSES
