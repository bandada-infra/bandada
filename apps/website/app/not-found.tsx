"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { AppContainer } from "@/components/AppContainer"
import { Section } from "@/components/typography/Section"
import { LABELS } from "@/shared/labels"
import { Button } from "@/components/elements/Button"

export default function NotFound() {
    return (
        <div className="bg-gradient-purple-pink">
            <AppContainer className="flex flex-col items-center text-center  justify-center gap-14 h-[calc(100vh-160px)] py-10">
                <Section.Header className="uppercase font-unbounded">
                    404: Page not found
                </Section.Header>
                <div className="relative size-[120px] md:size-[240px]">
                    <Image
                        src="/icons/feature-icon-1.svg"
                        fill
                        alt="404 illustration"
                    />
                </div>
                <span className=" text-baltic-sea-800 text-base font-normal md:font-medium md:text-lg font-sans">
                    The page you are looking for might have been removed, had
                    its name changed, or is temporarily unavailable.
                </span>
                <Link href="/">
                    <Button size="md">{LABELS.COMMON.GO_TO_HOME}</Button>
                </Link>
            </AppContainer>
        </div>
    )
}
