"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Glider from "react-glider"
import { AppContainer } from "@/components/AppContainer"
import { ProjectCard } from "@/components/cards/ProjectCard"
import { Button } from "@/components/elements/Button"
import { Label } from "@/components/elements/Label"
import { PROJECT_ITEMS } from "@/shared/data/projects"
import { LABELS } from "@/shared/labels"

import "glider-js/glider.min.css"
import useSettings from "@/hooks/useSettings"

export function Projects() {
    const { clientWidth, isLoaded } = useSettings()
    const ref = useRef<HTMLDivElement>(null)
    const refSlider = useRef<any>(null)

    useEffect(() => {
        if (clientWidth === 0) return
        // spacer distance to match starting position as AppContainer
        const containerWidth = ref.current?.clientWidth ?? 64

        const sliderSpacer = (clientWidth - containerWidth) / 2 || 32

        const element = refSlider.current.ele.querySelector(".glider-track")
        if (!element) return

        element.style.transform = `translateX(${sliderSpacer}px)`
        element.style.marginRight = `${sliderSpacer}px`
    }, [clientWidth])

    if (!isLoaded) return null

    return (
        <div className="bg-baltic-sea-950 flex flex-col gap-12 py-30">
            <AppContainer
                id="demo"
                ref={ref}
                className="flex flex-col gap-12 w-full"
            >
                <Label.Section color="white" size="xs" className="text-center">
                    {LABELS.HOMEPAGE.PROJECTS.TITLE}
                </Label.Section>
            </AppContainer>
            <div className="2xl:pl-0">
                <Glider
                    ref={refSlider}
                    draggable
                    slidesToShow={1.2}
                    slidesToScroll={1}
                    responsive={[
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 3.3
                            }
                        },
                        {
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 4.3
                            }
                        }
                    ]}
                >
                    {PROJECT_ITEMS.map((project, index) => (
                        <div className="pr-8 h-full" key={index}>
                            <ProjectCard
                                className="h-full"
                                key={index}
                                {...project}
                            />
                        </div>
                    ))}
                </Glider>
            </div>
            <AppContainer>
                <Link href="/projects" className="mx-auto">
                    <Button color="link">{LABELS.COMMON.VIEW_MORE}</Button>
                </Link>
            </AppContainer>
        </div>
    )
}
