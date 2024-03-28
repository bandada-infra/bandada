import { classed } from "@tw-classed/react"
import { Icons } from "./Icons"

function Bird() {
    return (
        <div className="flex justify-center py-10 w-full">
            <Icons.bird width={44} height={30} />
        </div>
    )
}
const Line = classed.div("w-full h-[1px] bg-baltic-sea-600")

const Divider = {
    displayName: "Divider",
    Bird,
    Line
}

export { Divider }
