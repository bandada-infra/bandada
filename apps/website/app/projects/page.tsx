import React from "react"
import Link from "next/link"
import { Banner } from "@/components/elements/Banner"
import { Button } from "@/components/elements/Button"
import { Label } from "@/components/elements/Label"
import { LINKS } from "@/common/settings"
import { LABELS } from "@/content/pages/label"
import { AppContainer } from "@/components/AppContainer"
import { ProjectList } from "../sections/projects/ProjectList"
import { HeaderIllustration } from "@/components/elements/HeaderIllustration"

export default function ProjectsPage() {
    return (
        <div className="bg-classic-rose-100">
            <div className="py-32">
                <HeaderIllustration image="/illustrations/project-page.svg" />
                <AppContainer>
                    <div className="flex flex-col gap-6 text-center py-10">
                        <Label.Section size="md">
                            {LABELS.PROJECTS.TITLE}
                        </Label.Section>
                        <div className="md:w-2/3 md:mx-auto">
                            <Label.SubTitle>
                                {LABELS.PROJECTS.SUBTITLE}
                            </Label.SubTitle>
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
