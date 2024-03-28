import { AppContainer } from "@/components/AppContainer"
import { ProjectCard } from "@/components/cards/ProjectCard"
import { Button } from "@/components/elements/Button"
import { Label } from "@/components/elements/Label"
import { LABELS } from "@/content/pages/label"
import { PROJECT_ITEMS } from "@/content/projects"

function Projects() {
    return (
        <div className="bg-baltic-sea-950 py-28">
            <AppContainer className="flex flex-col gap-12">
                <Label.Section color="white" size="xs" className="text-center">
                    {LABELS.HOMEPAGE.BUILD_WITH_BANDADA}
                </Label.Section>
                <div className="grid gap-8 lg:grid-cols-3">
                    {PROJECT_ITEMS.slice(0, 3).map((project, index) => (
                        <ProjectCard key={index} {...project} />
                    ))}
                </div>
                <Button className="mx-auto" color="link">
                    {LABELS.COMMON.VIEW_MORE}
                </Button>
            </AppContainer>
        </div>
    )
}
Projects.displayName = "Projects"
export { Projects }
