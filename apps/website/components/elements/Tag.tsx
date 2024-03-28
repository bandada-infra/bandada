import { classed } from "@tw-classed/react"
import { ReactNode } from "react"

const TagBase = classed.div("cursor-pointer font-dm-sans border duration-200", {
    variants: {
        variant: {
            primary:
                "bg-classic-rose-50 border-classic-rose-900 text-classic-rose-900",
            secondary:
                "bg-baltic-sea-50 border-baltic-sea-200 text-baltic-sea-400 hover:text-classic-rose-900"
        }
    },
    defaultVariants: {
        variant: "primary"
    }
})

const TagComponentRounded = classed.div(
    TagBase,
    "py-[2px] px-2 tracking-[0.26px] text-[13px] rounded-full"
)

const TagComponentSquare = classed.div(
    TagBase,
    "py-2 px-4 text-sm md:text-[18px] font-medium tracking-[0.18px] rounded-lg leading-[27px]"
)

type TagType = "rounded" | "square"
type TagProps = React.ComponentProps<typeof TagBase> & {
    children: ReactNode
    type?: TagType
    icon?: ReactNode
}

const TagByType: Record<TagType, any> = {
    rounded: TagComponentRounded,
    square: TagComponentSquare
}

function Tag({
    children,
    type = "rounded",
    icon,
    variant,
    ...props
}: TagProps) {
    const Component = TagByType[type]
    return (
        <Component variant={variant} {...props}>
            <div className="flex items-center gap-2">
                {icon}
                <div>{children}</div>
            </div>
        </Component>
    )
}

Tag.displayName = "Tag"

export { Tag }
