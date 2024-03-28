import { classed } from "@tw-classed/react"
import { forwardRef } from "react"

type Position = "top" | "right" | "bottom" | "left"
const ButtonBase = classed.button(
    "relative font-dm-sans font-medium self-start rounded-lg duration-200 ease-in-out"
)

const ButtonComponent = classed(ButtonBase, {
    variants: {
        color: {
            primary: "bg-gradient-bandada text-baltic-sea-50 hover:opacity-80",
            black: "bg-baltic-sea-950 text-baltic-sea-100",
            white: "bg-baltic-sea-100 text-baltic-sea-800",
            link: "bg-transparent text-baltic-sea-300 hover:text-classic-rose-300 after:content-[''] after:absolute after:hover:bg-classic-rose-300 after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-baltic-sea-300 !p-0"
        },
        size: {
            xs: "text-xs tracking-[0.14px] py-[10px] px-4",
            sm: "text-base tracking-[0.16px] px-4 py-2"
        }
    },
    defaultVariants: {
        color: "primary",
        size: "sm"
    }
})

const IconPositionMapping: Record<Position, string> = {
    top: "flex flex-col items-center",
    right: "flex flex-row-reverse gap-1 items-center",
    bottom: "flex flex-col-reverse gap-1 items-center",
    left: "flex items-center gap-1"
}

type ButtonProps = React.ComponentProps<typeof ButtonComponent> & {
    icon?: React.ReactNode // Add an icon prop
    iconPosition?: Position
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { icon, children, iconPosition = "right", ...rest } = props
    return (
        <ButtonComponent {...rest} ref={ref}>
            <div className={IconPositionMapping[iconPosition ?? "right"]}>
                {icon}
                <span>{children}</span>
            </div>
        </ButtonComponent>
    )
})

Button.displayName = "Button"

export { Button }
