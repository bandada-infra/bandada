import Link from "next/link"
import { Project } from "@/content/projects"
import { Card } from "./Card"
import { Tag } from "../elements/Tag"
import { Icons } from "../elements/Icons"

const ProjectLinkIconMapping: Record<string, any> = {
    website: Icons.website,
    github: Icons.github,
    discord: Icons.discord
}

function ProjectCard({ name, tagline, categories, links }: Project) {
    return (
        <Card.Base
            className="relative group flex flex-col gap-12 border-[3px] cursor-pointer hover:border-sunset-orange-500 duration-200 ease-in-out"
            variant="classic"
            padding="xs"
        >
            <div className="flex flex-col gap-[30px] ">
                <div className="flex gap-2 flex-wrap">
                    {categories?.map((category) => (
                        <Tag key={category}>{category}</Tag>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-[20px] text-baltic-sea-950 font-unbounded font-normal">
                        {name}
                    </h3>
                    <p className="text-baltic-sea-600 text-sm tracking-[0.14px] font-dm-sans">
                        {tagline}
                    </p>
                </div>
                <div className="z-10  ml-auto flex items-center gap-2">
                    {Object.entries(links ?? {}).map(([key, url]) => {
                        const Icon = ProjectLinkIconMapping[key]
                        return (
                            <Link key={key} href={url} target="_blank">
                                <Icon className="duration-300 text-baltic-sea-400 group-hover:text-sunset-orange-500" />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </Card.Base>
    )
}

ProjectCard.displayName = "ProjectCard"
export { ProjectCard }
