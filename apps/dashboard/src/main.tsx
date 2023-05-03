import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource/ibm-plex-sans"
import "@rainbow-me/rainbowkit/styles.css"
import { StrictMode } from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import { AuthContextProvider } from "./context/auth-context"
import NotFoundPage from "./pages/404"
import Home from "./pages/home"
import Manage from "./pages/manage"
import MyGroups from "./pages/my-groups"
import SIWE from "./pages/siwe"
import theme from "./styles"
import { getAdmin } from "./utils/session"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        async loader({ request }) {
            const { pathname } = new URL(request.url)

            if (["/login", "/sign-up"].includes(pathname) && getAdmin()) {
                throw redirect("/my-groups")
            }

            if (
                !["/", "/login", "/sign-up"].includes(pathname) &&
                !getAdmin()
            ) {
                throw redirect("/")
            }

            return null
        },
        children: [
            {
                path: "login",
                element: <SIWE />
            },
            {
                path: "sign-up",
                element: <SIWE />
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
