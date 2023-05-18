import "@fontsource/ibm-plex-sans"
import "@rainbow-me/rainbowkit/styles.css"
import { useContext, useMemo } from "react"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import { AuthContext } from "./context/authContext"
import NotFoundPage from "./pages/404"
import GroupPage from "./pages/group"
import GroupsPage from "./pages/groups"
import HomePage from "./pages/home"

export default function Routes(): JSX.Element {
    const { admin } = useContext(AuthContext)

    const router = useMemo(
        () =>
            createBrowserRouter([
                {
                    path: "/",
                    element: <HomePage />,
                    async loader({ request }) {
                        const { pathname } = new URL(request.url)

                        if (["/"].includes(pathname)) {
                            if (admin) {
                                throw redirect("/groups")
                            }
                        } else if (!admin) {
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
            ]),
        [admin]
    )

    return <RouterProvider router={router} />
}
