import { SystemStyleObject } from "@chakra-ui/react"
import { GlobalStyleProps } from "@chakra-ui/theme-tools"

const height = "48px"
const paddingX = "16px"
const paddingY = "12px"

const Button = {
    baseStyle: {
        _focus: {
            boxShadow: "none"
        },
        fontFamily: "DM Sans, sans-serif",
        borderRadius: 8,
        fontWeight: 500
    },
    variants: {
        outline: (): SystemStyleObject => ({
            height,
            paddingX,
            paddingY
        }),
        solid: (props: GlobalStyleProps): SystemStyleObject => {
            const { colorScheme: c } = props

            if (c === "primary") {
                const bgGradient =
                    "linear(to-r, sunsetOrange.500, classicRose.600)"
                const color = "balticSea.50"

                return {
                    bgGradient,
                    color,
                    height,
                    paddingX,
                    paddingY,
                    _hover: {
                        bgGradient:
                            "linear(to-r, sunsetOrange.600, classicRose.700)",
                        _disabled: {
                            bgGradient
                        }
                    },
                    _active: {
                        bgGradient:
                            "linear(to-r, sunsetOrange.700, classicRose.800)"
                    }
                }
            }

            if (c === "secondary") {
                const bg = "balticSea.950"
                const color = "balticSea.100"

                return {
                    bg,
                    fontWeight: 600,
                    fontSize: "13px",
                    color,
                    paddingX,
                    paddingY,
                    _hover: {
                        bg: "balticSea.900",
                        _disabled: {
                            bg
                        }
                    },
                    _active: { bg: "balticSea.700" }
                }
            }

            if (c === "tertiary") {
                const bg = "balticSea.100"
                const color = "balticSea.900"

                return {
                    bg,
                    fontWeight: 600,
                    fontSize: "13px",
                    color,
                    height,
                    paddingX,
                    paddingY,
                    _hover: {
                        bg: "balticSea.200",
                        _disabled: {
                            bg
                        }
                    },
                    _active: { bg: "balticSea.300" }
                }
            }

            if (c === "danger") {
                const bg = "sunsetOrange.200"
                const color = "sunsetOrange.950"

                return {
                    bg,
                    fontWeight: 600,
                    fontSize: "13px",
                    color,
                    height,
                    paddingX,
                    paddingY,
                    _hover: {
                        bg: "sunsetOrange.300",
                        _disabled: {
                            bg
                        }
                    },
                    _active: { bg: "sunsetOrange.400" }
                }
            }

            const bg = "rgba(0,0,0,0)"

            return {
                bg,
                color: `${c}.800`,
                height,
                paddingX,
                paddingY,
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
