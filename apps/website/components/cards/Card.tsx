import { classed } from "@tw-classed/react"

const CardBase = classed.div("rounded-lg break-all overflow-hidden", {
    variants: {
        border: {
            transparent: "border-transparent",
            gray: "border-baltic-sea-300",
            dark: "border-baltic-sea-800",
            primary: "border-sunset-orange-500"
        },
        borderSize: {
            xs: "border",
            sm: "border-2",
            md: "border-4"
        },
        variant: {
            white: "bg-white",
            baltic: "bg-baltic-sea-50",
            classic: "bg-classic-rose-50",
            transparent: "bg-transparent",
            content:
                "bg-transparent cursor-pointer duration-200 hover:bg-baltic-sea-500/50"
        },
        padding: {
            xs: "p-6",
            sm: "p-8",
            none: "p-0"
        },
        spacing: {
            sm: "flex flex-col gap-5",
            md: "flex flex-col gap-10"
        }
    },
    defaultVariants: {
        border: "transparent",
        variant: "white",
        padding: "sm",
        borderSize: "sm"
    }
})

const CardTitle = classed.h2("text-baltic-sea-950", {
    variants: {
        size: {
            sm: "text-lg leading-[27px] md:text-[22px] md:leading-[28px]",
            md: "text-[26px] md:text-[39px] leading-[28px]"
        }
    },
    defaultVariants: {
        size: "sm"
    }
})

const Card = {
    displayName: "Card",
    Base: CardBase,
    Title: CardTitle
}

export { Card }
