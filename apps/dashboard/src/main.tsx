import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource/ibm-plex-sans"
import "@rainbow-me/rainbowkit/styles.css"
import { StrictMode } from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import { isLoggedIn } from "./api/bandadaAPI"
import NotFoundPage from "./pages/404"
import Home from "./pages/home"
import Manage from "./pages/manage"
import MyGroups from "./pages/my-groups"
import SSO from "./pages/siwe"
import theme from "./styles"
import { AuthContextProvider } from "./context/auth-context"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        async loader({ request }) {
            const { pathname } = new URL(request.url)

            const _loggedIn = await isLoggedIn()

            if (["/login", "/sign-up"].includes(pathname)) {
                if (_loggedIn) {
                    throw redirect("/my-groups")
                }
            } else if (!_loggedIn) {
                throw redirect("/login")
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
                element: <MyGroups />
            },
            {
                path: "my-groups/:groupId",
                element: <Manage />
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
    <AuthContextProvider>
        <StrictMode>
            <ChakraProvider theme={theme}>
                <RouterProvider router={router} />
            </ChakraProvider>
        </StrictMode>
    </AuthContextProvider>
)
