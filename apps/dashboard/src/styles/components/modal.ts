import { SystemStyleObject } from "@chakra-ui/react"

const Modal = {
    baseStyle: (): SystemStyleObject => ({
        dialog: {
            maxHeight: "calc(100vh - 50px)",
            maxWidth: "1200px"
        }
    })
}

export default Modal
