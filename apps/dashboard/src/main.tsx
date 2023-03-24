import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource/ibm-plex-sans"
import {
    connectorsForWallets,
    RainbowKitProvider
} from "@rainbow-me/rainbowkit"
import {
    coinbaseWallet,
    injectedWallet,
    metaMaskWallet,
    walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets"
import { StrictMode } from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { goerli } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import NotFoundPage from "./pages/404"
import Home from "./pages/home"
import Manage from "./pages/manage"
import MyGroups from "./pages/my-groups"
import SSO from "./pages/sso"
import theme from "./styles"
import { isLoggedIn } from "./api/bandadaAPI"

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

async function requireAuth() {
    if (!(await isLoggedIn())) {
        throw redirect("/")
    }

    return null
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        loader: async ({ request }) => {
            const { pathname } = new URL(request.url)

            if (
                ["/", "/login", "/sign-up"].includes(pathname) &&
                (await isLoggedIn())
            ) {
                throw redirect("/my-groups")
            }

            return null
        },
        children: [
            {
                path: "login",
                element: <SSO />
            },
            {
                path: "sign-up",
                element: <SSO />
            },
            {
                path: "my-groups",
                element: <MyGroups />,
                loader: requireAuth
            },
            {
                path: "my-groups/:groupId",
                element: <Manage />,
                loader: requireAuth
            },
            {
                path: "*",
                element: <NotFoundPage />
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} initialChain={goerli}>
            <StrictMode>
                <ChakraProvider theme={theme}>
                    <RouterProvider router={router} />
                </ChakraProvider>
            </StrictMode>
        </RainbowKitProvider>
    </WagmiConfig>
)
