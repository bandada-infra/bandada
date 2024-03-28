import Image from "next/image"
import { AppContainer } from "@/components/AppContainer"
import { Label } from "@/components/elements/Label"
import { FeatureItems } from "@/content/features"
import { LABELS } from "@/content/pages/label"

function Features() {
    return (
        <div className="bg-classic-rose-100">
            <AppContainer className="grid grid-cols-1 gap-20 py-28 md:grid-cols-[200px_1fr] lg:gap-40">
                <Label.Section className="text-center md:text-left">
                    {LABELS.HOMEPAGE.BANDADA_FEATURES}
                </Label.Section>
                <div className="grid grid-cols-1 gap-12 md:gap-14 lg:grid-cols-2">
                    {FeatureItems.map(({ title, description, icon }, index) => (
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
                                <strong className="text-baltic-sea-950 font-unbounded text-[25px] leading-[30px] font-normal">
                                    {title}
                                </strong>
                                <span className="text-base text-baltic-sea-800 font-dm-sans">
                                    {description}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </AppContainer>
        </div>
    )
}

Features.displayName = "Features"
export { Features }
