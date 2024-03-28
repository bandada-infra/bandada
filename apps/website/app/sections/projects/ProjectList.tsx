"use client"

import { Card } from "@/components/cards/Card"
import { ProjectCard } from "@/components/cards/ProjectCard"
import { Icons } from "@/components/elements/Icons"
import { Tag } from "@/components/elements/Tag"
import { LABELS } from "@/content/pages/label"
import {
    Project,
    ProjectCategories,
    ProjectSource,
    ProjectsSources
} from "@/content/projects"
import useProjects from "@/hooks/useProjects"

const ProjectSourceMapping: Record<
    ProjectSource,
    {
        label: string
        icon: JSX.Element
    }
> = {
    pse: {
        label: "PSE",
        icon: <Icons.pse />
    },
    community: {
        label: "Community",
        icon: <Icons.community />
    }
}

interface ProjectResultsProps {
    projects?: Project[]
    noResult?: boolean
}

function ProjectResults({ projects, noResult }: ProjectResultsProps) {
    if (noResult) {
        return (
            <Card.Base>
                <div className="flex flex-col gap-[10px] p-8 md:p-0">
                    <Card.Title className="font-bold font-dm-sans text-center">
                        {LABELS.COMMON.NO_RESULT}
                    </Card.Title>
                    <span className="text-center font-dm-sans font-normal text-base md:text-lg text-baltic-sea-950 tracking-[0.18px] ">
                        {LABELS.COMMON.NO_RESULT_DESCRIPTION}
                    </span>
                </div>
            </Card.Base>
        )
    }

    return (
        <Card.Base className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project, index) => (
                <ProjectCard key={index} {...project} />
            ))}
        </Card.Base>
    )
}
function ProjectList() {
    const { projects, handleSource, source, categories, handleCategory } =
        useProjects()
    const noResult =
        projects.length === 0 && (source !== undefined || categories.length > 0)

    return (
        <div className="flex flex-col gap-8 pt-10 ">
            <Card.Base spacing="sm">
                <Card.Title className="font-bold font-dm-sans text-baltic-sea-950">
                    {LABELS.PROJECTS.CREATED_BY}
                </Card.Title>
                <div className="flex items-center gap-3">
                    {ProjectsSources.map((projectSource, index) => {
                        const { label, icon } =
                            ProjectSourceMapping[projectSource]

                        const isActive = source === projectSource

                        return (
                            <Tag
                                key={index}
                                type="square"
                                icon={icon}
                                variant={isActive ? "primary" : "secondary"}
                                onClick={() => handleSource(projectSource)}
                            >
                                <span className=" capitalize">{label}</span>
                            </Tag>
                        )
                    })}
                </div>
            </Card.Base>
            <Card.Base spacing="sm">
                <Card.Title className="font-bold font-dm-sans text-baltic-sea-950">
                    {LABELS.COMMON.CATEGORY}
                </Card.Title>
                <div className="flex flex-wrap gap-3">
                    {ProjectCategories.map((category, index) => {
                        const isActive = categories.includes(category)

                        return (
                            <Tag
                                key={index}
                                variant={isActive ? "primary" : "secondary"}
                                onClick={() => handleCategory(category)}
                            >
                                {category}
                            </Tag>
                        )
                    })}
                </div>
            </Card.Base>

            <ProjectResults projects={projects} noResult={noResult} />
        </div>
    )
}

ProjectList.displayName = "ProjectList"
export { ProjectList }
