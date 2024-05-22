import { useState } from "react"
import { arrayToggle } from "@/common/utils"
import { PROJECT_ITEMS, ProjectSource } from "@/shared/data/projects"

export default function useProjects() {
    const [source, setSource] = useState<ProjectSource | undefined>()

    const categoriesFromProjects = PROJECT_ITEMS.reduce<string[]>(
        (acc, project) => [...acc, ...(project.categories ?? [])],
        []
    )
    // unique categories
    const projectCategories = Array.from(new Set(categoriesFromProjects))

    const [categories, setCategories] = useState<string[]>([])

    const handleCategory = (category: string) => {
        setCategories(arrayToggle(categories, category))
    }

    const handleSource = (id: ProjectSource) => {
        if (source === id) {
            setSource(undefined)
            return
        }
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
        handleSource,
        projectCategories
    }
}
