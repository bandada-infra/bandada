import Image from "next/image"
import { classed } from "@tw-classed/react"
import { AppContainer } from "@/components/AppContainer"
import { Section } from "@/components/typography/Section"
import { LABELS } from "@/shared/labels"

const FeatureTitle = classed.h6(
    "text-baltic-sea-950 font-normal font-unbounded text-xl leading-6 md:leading-[30px] md:text-[25px]"
)

export function Features() {
    return (
        <div className="bg-classic-rose-100">
            <AppContainer className="grid grid-cols-1 gap-20 py-30 md:grid-cols-[200px_1fr] lg:gap-40">
                <Section.Title className="text-center md:text-left">
                    {LABELS.HOMEPAGE.FEATURES.TITLE}
                </Section.Title>
                <div className="grid grid-cols-1 gap-12 md:gap-14 lg:grid-cols-2">
                    {LABELS.HOMEPAGE.FEATURES.ITEMS.map(
                        ({ title, description, icon }, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-5 md:max-w-80 lg:even:ml-auto"
                            >
                                <Image
                                    src={icon}
                                    width={80}
                                    height={75}
                                    alt={`feature icon ${index + 1}`}
                                />
                                <div className="flex flex-col gap-2">
                                    <FeatureTitle>{title}</FeatureTitle>
                                    <Section.Description>
                                        {description}
                                    </Section.Description>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </AppContainer>
        </div>
    )
}
