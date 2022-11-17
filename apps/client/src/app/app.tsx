import { ChakraProvider } from "@chakra-ui/react"
import { Web3ReactProvider } from "@web3-react/core"
import { providers } from "ethers"
import { Route, Routes } from "react-router-dom"
import NavBar from "../components/navbar"
import Home from "../pages/home"
import PermissionedGroup from "../pages/permissioned-group"

export function App() {
    function getLibrary(provider: any) {
        return new providers.Web3Provider(provider)
    }

    return (
        <Web3ReactProvider getLibrary={(provider) => getLibrary(provider)}>
            <ChakraProvider>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/invites/:inviteCode"
                        element={<PermissionedGroup />}
                    />
                </Routes>
            </ChakraProvider>
        </Web3ReactProvider>
    )
}

export default App
