import { Route, Routes } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import NavBar from "src/components/navbar"
import Home from "src/pages/home"
import SSO from "src/pages/sso"
import MyGroups from "src/pages/my-groups"
import Manage from "src/pages/manage"
import theme from "src/styles"
import NotFoundPage from "src/pages/404"

export function App() {
    return (
        <ChakraProvider theme={theme}>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sso" element={<SSO />} />
                <Route path="/my-groups" element={<MyGroups />} />
                <Route path="/my-groups/:groupName" element={<Manage />} />
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </ChakraProvider>
    )
}

export default App
