import Link from "next/link"
import { Project } from "@/shared/data/projects"
import { Card } from "./Card"
import { Tag } from "../elements/Tag"
import { Icons } from "../elements/Icons"

const ProjectLinkIconMapping: Record<string, any> = {
    website: Icons.website,
    github: Icons.github,
    discord: Icons.discord
}

interface ProjectCardProps extends Project {}

export function ProjectCard({
    name,
    tagline,
    categories,
    links
}: ProjectCardProps) {
    return (
        <Card.Base
            className="relative group flex flex-col gap-12 border-[3px] md:hover:border-sunset-orange-500 ease-in-out"
            variant="classic"
            padding="xs"
        >
            <div className="flex flex-col gap-[30px] ">
                <div className="flex gap-2 flex-wrap min-h-[50px] md:min-h-[25px]">
                    {categories?.map((category) => (
                        <Tag key={category}>{category}</Tag>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl leading-6 text-baltic-sea-950 font-unbounded font-normal line-clamp-1">
                        {name}
                    </h3>
                    <div className="min-h-16">
                        <p className="text-baltic-sea-600 text-sm tracking-[0.14px] font-dm-sans leading-5 line-clamp-2">
                            {tagline}
                        </p>
                    </div>
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
