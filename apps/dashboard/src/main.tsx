import { StrictMode } from "react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { CookiesProvider } from "react-cookie"
import {
    connectorsForWallets,
    RainbowKitProvider
} from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { goerli } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import {
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    trustWallet,
    ledgerWallet,
    injectedWallet
} from "@rainbow-me/rainbowkit/wallets"
import App from "./app/app"
import theme from "./styles"

const { chains, provider, webSocketProvider } = configureChains(
    [goerli],
    [publicProvider()]
)

const connectors = connectorsForWallets([
    {
        groupName: "Wallets",
        wallets: [
            injectedWallet({ chains }),
            metaMaskWallet({ chains }),
            coinbaseWallet({ appName: "Zk Groups", chains }),
            walletConnectWallet({ chains })
        ]
    }
])

const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
    webSocketProvider
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} initialChain={goerli}>
            <StrictMode>
                <CookiesProvider>
                    <ChakraProvider theme={theme}>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </ChakraProvider>
                </CookiesProvider>
            </StrictMode>
        </RainbowKitProvider>
    </WagmiConfig>
)
