import {
    connectorsForWallets,
    lightTheme,
    AuthenticationStatus,
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider
} from "@rainbow-me/rainbowkit"
import React, { ReactNode } from "react"
import {
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    trustWallet,
    ledgerWallet
} from "@rainbow-me/rainbowkit/wallets"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { mainnet } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { SiweMessage } from "siwe"
import { signIn } from "../api/bandadaAPI"
import { deleteUser, getUser, saveUser } from "../utils/auth"
import { User } from "../types/user"

const { chains, provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
)

const connectors = connectorsForWallets([
    {
        groupName: "Wallets",
        wallets: [
            metaMaskWallet({ chains }),
            coinbaseWallet({ appName: "Bandada", chains }),
            walletConnectWallet({ chains }),
            trustWallet({ chains }),
            ledgerWallet({ chains })
        ]
    }
])

const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
    webSocketProvider
})

type AuthContextParams = {
    user: User | null
}

export const AuthContext = React.createContext<AuthContextParams>({
    user: getUser()
})

const customTheme = lightTheme()
customTheme.radii.modal = "10px"

export function AuthContextProvider(props: { children: ReactNode }) {
    const { children } = props
    const verifyingRef = React.useRef(false)

    const [user, setUser] = React.useState<User | null>(getUser())

    const [authStatus, setAuthStatus] =
        React.useState<AuthenticationStatus>("loading")

    React.useEffect(() => {
        setAuthStatus(getUser() ? "authenticated" : "unauthenticated")
    }, [])

    const authAdapter = React.useMemo(
        () =>
            createAuthenticationAdapter({
                async getNonce() {
                    return Math.random().toString(36).substring(7)
                },

                createMessage: ({ nonce, address, chainId }) =>
                    new SiweMessage({
                        domain: window.location.host,
                        address,
                        statement: "Sign in with Ethereum to the app.",
                        uri: window.location.origin,
                        version: "1",
                        chainId,
                        nonce
                    }),

                getMessageBody: ({ message }) => message.prepareMessage(),

                verify: async ({ message, signature }) => {
                    verifyingRef.current = true

                    try {
                        const { user: _user } = await signIn({
                            message,
                            signature
                        })

                        saveUser(_user)

                        setAuthStatus(
                            _user ? "authenticated" : "unauthenticated"
                        )
                        setUser(_user)

                        return true
                    } catch (error) {
                        console.error(error)
                        return false
                    } finally {
                        verifyingRef.current = false
                    }
                },

                signOut: async () => {
                    setAuthStatus("unauthenticated")
                    deleteUser()
                }
            }),
        []
    )

    return (
        <AuthContext.Provider
            value={{
                user
            }}
        >
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
        </AuthContext.Provider>
    )
}
