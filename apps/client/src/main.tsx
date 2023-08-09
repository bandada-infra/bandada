import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource-variable/unbounded"
import { Web3ReactProvider } from "@web3-react/core"
import { providers } from "ethers"
import * as ReactDOM from "react-dom/client"
import Routes from "./routes"
import theme from "./styles"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <Web3ReactProvider
        getLibrary={(provider) => new providers.Web3Provider(provider)}
    >
        <ChakraProvider theme={theme}>
            <Routes />
        </ChakraProvider>
    </Web3ReactProvider>
)
