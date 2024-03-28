import Image from "next/image"
import { AppContainer } from "@/components/AppContainer"
import { Label } from "@/components/elements/Label"
import { EVENTS, Event } from "@/content/events"
import { LABELS } from "@/content/pages/label"

function EventCard({ date, event, description }: Event) {
    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-baltic-sea-950 font-dm-sans text-[22px] font-bold">
                {`${date} | ${event}`}
            </h4>
            {description && (
                <Label.Paragraph className="!text-base">
                    {description}
                </Label.Paragraph>
            )}
        </div>
    )
}

function Events() {
    return (
        <div className="bg-classic-rose-100 py-28">
            <AppContainer className="flex flex-col gap-20">
                <div className=" grid grid-cols-1 gap-20 md:grid-cols-[200px_1fr] lg:gap-40">
                    <Label.Section className="text-center md:text-left">
                        {LABELS.HOMEPAGE.FIND_EVENTS}
                    </Label.Section>
                    <div className="grid grid-cols-1 gap-14">
                        {EVENTS.map((event, index) => (
                            <EventCard key={index} {...event} />
                        ))}
                    </div>
                </div>
                <div className="bg-cover overflow-hidden rounded-3xl md:h-[450px]">
                    <Image
                        src="/images/bg-events.png"
                        alt="Events"
                        width={800}
                        height={800}
                        className="object-cover w-full rounded-3xl"
                    />
                </div>
            </AppContainer>
        </div>
    )
}

Events.displayName = "Events"
export { Events }
