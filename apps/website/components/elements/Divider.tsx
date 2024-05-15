import { classed } from "@tw-classed/react"
import { Icons } from "./Icons"

function Bird() {
    return (
        <div className="flex justify-center py-10 w-full">
            <Icons.Bird width={30} height={44} />
        </div>
    )
}
const Line = classed.div("w-full h-[1px] ", {
    variants: {
        color: {
            light: "dashed-line",
            dark: "dashed-line-dark"
        }
    },
    defaultVariants: {
        color: "light"
    }
})

const Divider = {
    displayName: "Divider",
    Bird,
    Line
}

export { Divider }
