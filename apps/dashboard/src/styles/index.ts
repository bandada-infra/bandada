import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"
import colors from "./colors"
import components from "./components"

const config = {
    fonts: {
        heading: "IBM Plex Sans, sans-serif",
        body: "IBM Plex Sans, sans-serif"
    },
    colors,
    styles,
    components
}

export default extendTheme(config)
