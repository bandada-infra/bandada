import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/home"

export default function Routes(): JSX.Element {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage />
        }
    ])

    return <RouterProvider router={router} />
}
