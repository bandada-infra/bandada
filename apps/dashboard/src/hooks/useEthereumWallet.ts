import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { providers } from "ethers"

const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
})

type ReturnParameters = {
    isWalletConnected: () => Promise<boolean>
    connectWallet: () => Promise<void>
    disconnect: () => Promise<void>
    account: any
}

export default function useEthereumWallet(): ReturnParameters {
    const { activate, account, deactivate } =
        useWeb3React<providers.Web3Provider>()

    async function isWalletConnected() {
        const isConnected = await injectedConnector.isAuthorized()
        return isConnected
    }

    async function connectWallet() {
        try {
            await activate(injectedConnector)
        } catch (error) {
            console.error(error)
            return
        }
    }

    async function disconnect() {
        try {
            deactivate()
        } catch (error) {
            console.error(error)
        }
    }

    return { isWalletConnected, connectWallet, disconnect, account }
}
