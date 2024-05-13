import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Banner } from "@/components/elements/Banner"
import { Button } from "@/components/elements/Button"
import { LINKS } from "@/common/settings"
import { AppContainer } from "@/components/AppContainer"
import { ProjectList } from "../sections/projects/ProjectList"
import { LABELS } from "@/shared/labels"
import { Section } from "@/components/typography/Section"

function Illustration() {
    return (
        <AppContainer className="relative">
            <Image
                src="/illustrations/birds-projects.svg"
                alt="birds illustrations"
                className="absolute w-auto max-w-max translate-x-16 z-[2] translate-y-[50px] -top-12 md:translate-y-4 md:top-0 md:translate-x-full"
                height={211}
                width={533}
            />
            <div className="h-[270px] overflow-x-hidden">
                <Image
                    className="absolute inset-0 md:relative flex mx-auto top-1/2 -translate-y-1/2 -translate-x-32 md:-translate-x-60 "
                    src="/illustrations/clouds-projects.svg"
                    height={96}
                    width={520}
                    alt="projects banner"
                />
            </div>
        </AppContainer>
    )
}

export default function ProjectsPage() {
    return (
        <div className="bg-classic-rose-100">
            <div className="py-30">
                <Illustration />
                <AppContainer>
                    <div className="flex flex-col gap-6 text-center py-10">
                        <Section.Header>{LABELS.PROJECTS.TITLE}</Section.Header>
                        <div className="md:w-2/3 md:mx-auto">
                            <Section.Description subtitle>
                                {LABELS.PROJECTS.SUBTITLE}
                            </Section.Description>
                        </div>
                    </div>
                    <ProjectList />
                </AppContainer>
            </div>

            <Banner
                title={LABELS.PROJECTS.BANNER.TITLE}
                description={LABELS.PROJECTS.BANNER.DESCRIPTION}
            >
                <Link href={LINKS.SUBMIT_PROJECT} target="_blank">
                    <Button color="black">
                        {LABELS.COMMON.SUBMIT_PROJECT}
                    </Button>
                </Link>
            </Banner>
        </div>
    )
}
