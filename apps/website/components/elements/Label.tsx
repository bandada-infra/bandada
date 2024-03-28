import { classed } from "@tw-classed/react"

const SectionTitle = classed.h2("font-unbounded font-normal", {
    variants: {
        color: {
            black: "text-baltic-sea-950",
            white: "text-baltic-sea-50"
        },
        size: {
            xs: "text-[31px] leading-[37px]",
            sm: "text-[39px] leading-[46px]",
            md: "text-[39px] leading-[46px] md:text-[49px] md:leading-[58.8px] xl:text-[61px] xl:leading-[73.2px]"
        }
    },
    defaultVariants: {
        color: "black",
        size: "sm"
    }
})

const SectionSubtitle = classed.h3(
    "text-baltic-sea-800 text-base leading-[24px] tracking-[0.18px] font-dm-sans font-normal font-medium md:text-[18px] md:leading-[27px]"
)

const SectionContentTitle = classed.h2(
    "text-2xl font-unbounded font-normal text-baltic-sea-950"
)
const SectionContent = classed.h3(
    "text-baltic-sea-800 text-[18px] tracking-[0.18px] font-dm-sans font-normal font-medium leading-[27px]"
)

const MenuItem = classed.span(
    "text-baltic-sea-50 text-base font-dm-sans font-medium tracking-[0.16px] gap-2 py-2"
)

const Content = classed.span(
    "text-base font-dm-sans font-normal text-baltic-sea-700"
)
const Label = {
    displayName: "Label",
    Section: SectionTitle,
    SubTitle: SectionSubtitle,
    Paragraph: SectionContent,
    ParagraphTitle: SectionContentTitle,
    Content,
    MenuItem
}

export { Label }
