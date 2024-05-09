"use client"

import Link from "next/link"
import Glider from "react-glider"
import { AppContainer } from "@/components/AppContainer"
import { ProjectCard } from "@/components/cards/ProjectCard"
import { Button } from "@/components/elements/Button"
import { Label } from "@/components/elements/Label"
import { PROJECT_ITEMS } from "@/shared/data/projects"
import { LABELS } from "@/shared/labels"

import "glider-js/glider.min.css"

export function Projects() {
    return (
        <div className="bg-baltic-sea-950 py-30">
            <AppContainer className="flex flex-col gap-12">
                <Label.Section color="white" size="xs" className="text-center">
                    {LABELS.HOMEPAGE.PROJECTS.TITLE}
                </Label.Section>

                <div>
                    <Glider
                        draggable
                        slidesToShow={1.1}
                        slidesToScroll={1}
                        responsive={[
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 3.3
                                }
                            }
                        ]}
                    >
                        {PROJECT_ITEMS.map((project, index) => (
                            <div className="pr-8" key={index}>
                                <ProjectCard key={index} {...project} />
                            </div>
                        ))}
                    </Glider>
                </div>

                <Link href="/projects" className="mx-auto">
                    <Button color="link">{LABELS.COMMON.VIEW_MORE}</Button>
                </Link>
            </AppContainer>
        </div>
    )
}
