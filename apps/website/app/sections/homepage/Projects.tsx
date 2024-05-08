import Link from "next/link"
import { AppContainer } from "@/components/AppContainer"
import { ProjectCard } from "@/components/cards/ProjectCard"
import { Button } from "@/components/elements/Button"
import { Label } from "@/components/elements/Label"
import { PROJECT_ITEMS } from "@/shared/data/projects"
import { LABELS } from "@/shared/labels"

export function Projects() {
    return (
        <div className="bg-baltic-sea-950 py-30">
            <AppContainer className="flex flex-col gap-12">
                <Label.Section color="white" size="xs" className="text-center">
                    {LABELS.HOMEPAGE.PROJECTS.TITLE}
                </Label.Section>
                <div className="grid gap-8 lg:grid-cols-3">
                    {PROJECT_ITEMS.slice(0, 3).map((project, index) => (
                        <ProjectCard key={index} {...project} />
                    ))}
                </div>
                <Link href="/projects" className="mx-auto">
                    <Button color="link">{LABELS.COMMON.VIEW_MORE}</Button>
                </Link>
            </AppContainer>
        </div>
    )
}
