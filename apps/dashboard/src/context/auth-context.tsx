import {
    AuthenticationStatus,
    connectorsForWallets,
    createAuthenticationAdapter,
    lightTheme,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider
} from "@rainbow-me/rainbowkit"
import {
    coinbaseWallet,
    injectedWallet,
    metaMaskWallet,
    walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets"
import React, { ReactNode, useMemo, useState } from "react"
import { SiweMessage } from "siwe"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { goerli } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { getNonce, logOut, signIn } from "../api/bandadaAPI"
import { deleteAdmin, getAdmin, saveAdmin } from "../utils/session"

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
            coinbaseWallet({ appName: "Bandada", chains }),
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

const customTheme = lightTheme()
customTheme.radii.modal = "10px"

export function AuthContextProvider(props: { children: ReactNode }) {
    const { children } = props

    const [authStatus, setAuthStatus] =
        useState<AuthenticationStatus>("loading")

    React.useEffect(() => {
        setAuthStatus(getAdmin() ? "authenticated" : "unauthenticated")
    }, [])

    const authAdapter = useMemo(
        () =>
            createAuthenticationAdapter({
                async getNonce() {
                    const nonce = await getNonce()

                    return nonce ?? ""
                },

                createMessage: ({ nonce, address, chainId }) =>
                    new SiweMessage({
                        domain: window.location.host,
                        address,
                        statement:
                            "You are using your Ethereum Wallet to sign in to Bandada.",
                        uri: window.location.origin,
                        version: "1",
                        chainId,
                        nonce
                    }),

                getMessageBody: ({ message }) => message.prepareMessage(),

                verify: async ({ message, signature }) => {
                    const user = await signIn({
                        message,
                        signature
                    })

                    if (user) {
                        setAuthStatus("authenticated")
                        saveAdmin(user.address)

                        window.location.reload()

                        return true
                    }

                    setAuthStatus("unauthenticated")

                    return false
                },

                signOut: async () => {
                    await logOut()

                    deleteAdmin()

                    setAuthStatus("unauthenticated")
                }
            }),
        []
    )

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitAuthenticationProvider
                adapter={authAdapter}
                status={authStatus}
            >
                <RainbowKitProvider
                    chains={chains}
                    modalSize="compact"
                    theme={customTheme}
                    appInfo={{
                        appName: "Bandada"
                    }}
                    showRecentTransactions={false}
                >
                    {children}
                </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
        </WagmiConfig>
    )
}
