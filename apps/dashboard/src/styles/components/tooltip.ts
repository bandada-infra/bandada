import { defineStyleConfig } from "@chakra-ui/react"
import colors from "../colors"

const baseStyle = {
    borderRadius: "md",
    fontWeight: "normal",
    border: "1px solid",
    backgroundColor: colors.classicRose[50],
    color: colors.sunsetOrange[500],
    boxShadow: `0px 2px 4px ${colors.classicRose[300]}`
}

export const tooltipTheme = defineStyleConfig({ baseStyle })
