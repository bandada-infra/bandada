import { useState } from "react"
import { arrayToggle } from "@/common/utils"
import {
    PROJECT_ITEMS,
    ProjectCategory,
    ProjectSource
} from "@/content/projects"

export default function useProjects() {
    const [source, setSource] = useState<ProjectSource | undefined>()

    const [categories, setCategories] = useState<ProjectCategory[]>([])

    const handleCategory = (category: ProjectCategory) => {
        setCategories(arrayToggle(categories, category))
    }

    const handleSource = (id: ProjectSource) => {
        setSource(id)
    }

    const projects = PROJECT_ITEMS
        // filter by source
        .filter((project) =>
            source ? project.pse === (source === "pse") : true
        )
        // filter by category
        .filter((project) =>
            categories.length === 0
                ? true
                : categories.some((category) =>
                      project?.categories?.includes(category)
                  )
        )

    return {
        source,
        categories,
        projects,
        handleCategory,
        handleSource
    }
}
