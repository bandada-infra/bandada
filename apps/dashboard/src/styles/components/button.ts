import { SystemStyleObject } from "@chakra-ui/react"
import { GlobalStyleProps } from "@chakra-ui/theme-tools"

const Button = {
    baseStyle: {
        _focus: {
            boxShadow: "none"
        },
        borderRadius: 0,
        fontWeight: 500
    },
    variants: {
        solid: (props: GlobalStyleProps): SystemStyleObject => {
            const { colorScheme: c } = props

            const width = "220px"
            const height = "60px"

            if (c === "primary") {
                const bg = `${c}.800`
                const color = `${c}.50`

                return {
                    bg,
                    color,
                    width,
                    height,
                    _hover: {
                        bg: `${c}.700`,
                        _disabled: {
                            bg
                        }
                    },
                    _active: { bg: `${c}.900` }
                }
            }

            const bg = "rgba(0,0,0,0)"

            return {
                bg,
                color: `${c}.800`,
                width,
                height,
                _hover: {
                    bg: `${c}.200`,
                    _disabled: {
                        bg
                    }
                },
                _active: { bg: `${c}.300` }
            }
        }
    }
}

export default Button
