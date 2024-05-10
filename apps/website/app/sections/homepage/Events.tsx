import Image from "next/image"
import Link from "next/link"
import { AppContainer } from "@/components/AppContainer"
import { EVENTS, Event } from "@/shared/data/events"
import { Section } from "@/components/typography/Section"
import { LABELS } from "@/shared/labels"

function EventCard({ date, event, description, link }: Event) {
    return (
        <Link
            target="_blank"
            href={link}
            className="group flex flex-col gap-2 py-8 first-of-type:pt-0 last-of-type:pb-0"
        >
            <h4 className="text-baltic-sea-950 font-dm-sans text-[22px] leading-[27px] font-bold duration-200 group-hover:text-orange-600">
                {`${date} | ${event}`}
            </h4>
            {description && (
                <Section.Description className="duration-200 group-hover:text-orange-600">
                    {description}
                </Section.Description>
            )}
        </Link>
    )
}

export function Events() {
    return (
        <div className="bg-classic-rose-100 py-30">
            <AppContainer className="flex flex-col gap-20">
                <div className=" grid grid-cols-1 gap-20 md:grid-cols-[215px_1fr] lg:gap-40">
                    <div className="w-[215px]">
                        <Section.Title>
                            {LABELS.HOMEPAGE.EVENTS.TITLE}
                        </Section.Title>
                    </div>
                    <div className="grid grid-cols-1 divide-y divide-baltic-sea-300">
                        {EVENTS.map((event, index) => (
                            <EventCard key={index} {...event} />
                        ))}
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl h-[450px]">
                    <Image
                        src="/images/bg-events.webp"
                        alt="Events"
                        fill
                        className="object-cover bg-center rounded-3xl"
                    />
                </div>
            </AppContainer>
        </div>
    )
}
