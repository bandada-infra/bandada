import { ChakraProvider } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import { Web3ReactProvider } from "@web3-react/core"
import { providers } from "ethers"
import NavBar from "src/components/navbar"
import Home from "src/pages/home"
import PermissionedGroup from "src/pages/permissioned-group"

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
                        path="/redeem/invite/:groupName/:invitationCode"
                        element={<PermissionedGroup />}
                    />
                </Routes>
            </ChakraProvider>
        </Web3ReactProvider>
    )
}

export default App
