import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource-variable/unbounded"
import "@rainbow-me/rainbowkit/styles.css"
import * as ReactDOM from "react-dom/client"
import { AuthContextProvider } from "./context/auth-context"
import Routes from "./routes"
import theme from "./styles"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <AuthContextProvider>
        <ChakraProvider
            theme={theme}
            toastOptions={{ defaultOptions: { position: "bottom" } }}
        >
            <Routes />
        </ChakraProvider>
    </AuthContextProvider>
)
