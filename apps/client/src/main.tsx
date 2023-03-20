import { StrictMode } from "react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import App from "./app"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL || ''}>
            <ChakraProvider>
                <App />
            </ChakraProvider>
        </BrowserRouter>
    </StrictMode>
)
