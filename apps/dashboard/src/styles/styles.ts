import { SystemStyleObject } from "@chakra-ui/react"
import { Styles } from "@chakra-ui/theme-tools"

const styles: Styles = {
    global: (): SystemStyleObject => ({
        body: {
            bg: "background.900"
        },
        "body, #root, #root > div": {
            minHeight: "100vh"
        },
        "#root > div": {
            display: "flex",
            flexDirection: "column"
        }
    })
}

export default styles
