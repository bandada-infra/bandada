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
import React, { ReactNode, useEffect, useMemo, useState } from "react"
import { SiweMessage } from "siwe"
import { createConfig, http, WagmiProvider } from "wagmi"
import { sepolia } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { getNonce, logOut, signIn } from "../api/bandadaAPI"
import useSessionData from "../hooks/use-session-data"
import { Admin } from "../types"

const appName = "Bandada"

export const AuthContext = React.createContext<{ admin?: Admin | null }>({})

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [authStatus, setAuthStatus] =
        useState<AuthenticationStatus>("loading")
    const { admin, saveAdmin, deleteAdmin } = useSessionData()

    useEffect(() => {
        setAuthStatus(admin ? "authenticated" : "unauthenticated")
    }, [admin])

    const contextValue = useMemo(() => ({ admin }), [admin])
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
                    const admin: Admin = await signIn({
                        message,
                        signature
                    })

                    if (admin) {
                        saveAdmin(admin)

                        return true
                    }

                    return false
                },

                signOut: async () => {
                    await logOut()

                    deleteAdmin()
                }
            }),
        [saveAdmin, deleteAdmin]
    )

    const connectors = connectorsForWallets(
        [
            {
                groupName: "Wallets",
                wallets: [
                    injectedWallet,
                    metaMaskWallet,
                    coinbaseWallet,
                    walletConnectWallet
                ]
            }
        ],
        {
            appName,
            projectId: process.env.PROJECT_ID! // WALLET CONNECT PROJECT ID
        }
    )

    const wagmiConfig = createConfig({
        chains: [sepolia],
        transports: {
            [sepolia.id]: http()
        },
        connectors
    })

    const queryClient = new QueryClient()

    return (
        <AuthContext.Provider value={contextValue}>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitAuthenticationProvider
                        adapter={authAdapter}
                        status={authStatus}
                    >
                        <RainbowKitProvider
                            modalSize="compact"
                            theme={lightTheme()}
                            appInfo={{
                                appName
                            }}
                            showRecentTransactions={false}
                        >
                            {children}
                        </RainbowKitProvider>
                    </RainbowKitAuthenticationProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </AuthContext.Provider>
    )
}
