import { ChakraProvider } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import NavBar from "../components/navbar"
import NotFoundPage from "../pages/404"
import Home from "../pages/home"
import Manage from "../pages/manage"
import MyGroups from "../pages/my-groups"
import SSO from "../pages/sso"
import theme from "../styles"
import { Web3ReactProvider } from "@web3-react/core"
import { providers } from "ethers"

export function App() {
    function getLibrary(provider: any) {
        return new providers.Web3Provider(provider)
    }

    return (
        <Web3ReactProvider getLibrary={(provider) => getLibrary(provider)}>
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
        </Web3ReactProvider>
    )
}

export default App
