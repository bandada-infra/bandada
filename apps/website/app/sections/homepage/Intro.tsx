"use client"

import Image from "next/image"
import { classed } from "@tw-classed/react"
import { AppContainer } from "@/components/AppContainer"
import { Section } from "@/components/typography/Section"
import { LABELS } from "@/shared/labels"
import useSettings from "@/hooks/useSettings"

const Cloud = classed(Image, "absolute z-0 rotate-y-180", {})

function Clouds() {
    return (
        <>
            {/* CLOUDS LEFT SIDE */}
            <Cloud
                className="top-16 -left-[220px] md:-left-[320px] md:top-[320px]"
                alt="left cloud 4 outline"
                height={102}
                width={719}
                src="./clouds/cloud-4-outline.svg"
            />
            <Cloud
                className="top-4 left-[-150px] md:-left-[280px] md:top-[110px] "
                alt="left cloud 2"
                height={100}
                width={1053}
                src="./clouds/cloud-2.svg"
            />
            <Cloud
                className="-left-[451px] md:bottom-5 "
                alt="left cloud 6"
                height={232}
                width={739}
                src="./clouds/cloud-6.svg"
            />

            {/* CLOUDS RIGHT SIDE */}
            <Cloud
                className="hidden md:flex md:-right-[410px] top-5"
                alt="right cloud 3"
                height={170}
                width={835}
                src="./clouds/cloud-3.svg"
            />
            <Cloud
                className="hidden lg:flex lg:right-[-500px] xl:-right-[410px] bottom-36"
                alt="right cloud 5"
                height={332}
                width={835}
                src="./clouds/cloud-5.svg"
            />
            <Cloud
                className="bottom-20 -right-40 md:-right-[280px]"
                alt="right cloud 5 outline"
                height={332}
                width={835}
                src="./clouds/cloud-5-outline.svg"
            />
        </>
    )
}

export function Intro() {
    const { clientWidth, clientHeight, HEADER_SIZE } = useSettings()
    return (
        <div
            className="relative overflow-x-hidden bg-gradient-purple-pink bg-cover bg-center flex flex-col"
            style={{
                minHeight: `${clientHeight - HEADER_SIZE}px`
            }}
        >
            {/* BIRDS FLOCK */}
            <Image
                className="z-[1] min-w-[1200px] h-[596px] md:h-auto md:w-full md:my-auto"
                alt="birds flock"
                width={clientWidth}
                height={511}
                src="./birds/flock-3.svg"
            />

            <Clouds />

            <div className="absolute z-[2] bottom-0 left-0 right-0 bg-gradient-pink-transparent backdrop-blur-[2.5px] py-15 md:py-30">
                <AppContainer className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="md:max-w-[656px]">
                        <Section.Title mobileSize="sm">
                            {LABELS.HOMEPAGE.INTRO.TITLE}
                        </Section.Title>
                    </div>
                    <Section.Description
                        className="inline-flex break-words"
                        subtitle
                    >
                        {LABELS.HOMEPAGE.INTRO.DESCRIPTION}
                    </Section.Description>
                </AppContainer>
            </div>
        </div>
    )
}
