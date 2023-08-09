import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"
import colors from "./colors"
import components from "./components"

const config = {
    fonts: {
        heading: "Unbounded Variable, sans-serif",
        body: "DM Sans, sans-serif"
    },
    colors,
    styles,
    components
}

export default extendTheme(config)
