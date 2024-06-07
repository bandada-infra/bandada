import { classed } from "@tw-classed/react"

const SectionHeader = classed.h1(
    "font-unbounded text-baltic-sea-950 text-[39px] leading-[46.8px] md:text-[49px] md:leading-[58.8px] lg:text-[61px] leading:[73.2px]"
)

const SectionTitle = classed.h3(
    "font-unbounded font-normal leading-[120%] text-black text-[39px] md:text-[39px]",
    {
        variants: {
            mobileSize: {
                sm: "!text-[31px]"
            }
        }
    }
)

const SectionParagraph = classed.span(
    "text-base text-baltic-sea-800 font-dm-sans leading-6",
    {
        variants: {
            subtitle: {
                true: "font-medium tracking-[0.16px] md:leading-[27px] md:tracking-[0.18px] md:text-lg",
                false: "font-normal"
            }
        },
        defaultVariants: {
            subtitle: false
        }
    }
)

export const Section = {
    displayName: "Section",
    Header: SectionHeader,
    Title: SectionTitle,
    Description: SectionParagraph
}
