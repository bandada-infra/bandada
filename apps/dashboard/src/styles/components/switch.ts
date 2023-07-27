import { switchAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"

const { definePartsStyle } = createMultiStyleConfigHelpers(switchAnatomy.keys)

const Switch = {
    defaultProps: {
        size: "sm"
    },
    baseStyle: definePartsStyle({
        thumb: {
            bgGradient: "linear(to-r, sunsetOrange.500, classicRose.600)"
        },
        track: {
            borderColor: "sunsetOrange.500",
            borderWidth: "2px",
            bg: "inherit",
            _checked: {
                bg: "inherit"
            }
        }
    })
}

export default Switch
