import { classed } from "@tw-classed/react"

export const AppContainer = classed.div("mx-auto 2xl:px-0 max-w-screen-xl", {
    variants: {
        margins: {
            sm: "px-4",
            md: "px-8"
        }
    },
    defaultVariants: {
        margins: "md"
    }
})
