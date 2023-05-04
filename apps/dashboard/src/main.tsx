import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource/ibm-plex-sans"
import "@rainbow-me/rainbowkit/styles.css"
import { StrictMode } from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import { AuthContextProvider } from "./context/auth-context"
import NotFoundPage from "./pages/404"
import HomePage from "./pages/home"
import GroupPage from "./pages/group"
import GroupsPage from "./pages/groups"
import theme from "./styles"
import { getAdmin } from "./utils/session"

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        async loader({ request }) {
            const { pathname } = new URL(request.url)

            if (["/"].includes(pathname)) {
                if (getAdmin()) {
                    throw redirect("/groups")
                }
            } else if (!getAdmin()) {
                throw redirect("/")
            }

            return null
        },
        children: [
            {
                path: "groups",
                element: <GroupsPage />
            },
            {
                path: "groups/:groupType/:groupId",
                element: <GroupPage />
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
