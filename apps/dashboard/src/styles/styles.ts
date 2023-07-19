import { SystemStyleObject } from "@chakra-ui/react"
import { Styles } from "@chakra-ui/theme-tools"

const styles: Styles = {
    global: (): SystemStyleObject => ({
        body: {
            bg: "background.50"
        },
        "body, #root, #root > div": {
            minHeight: "100vh"
        },
        "#root > div": {
            display: "flex",
            flexDirection: "column"
        },
        h1: {
            fontWeight: "400 !important"
        },
        "h2, h3": {
            fontWeight: "500 !important"
        },
        input: {
            fontSize: "16px !important"
        }
    })
}

export default styles
