import { arrayToggle } from "@/common/utils";
import {
  PROJECT_ITEMS,
  ProjectCategory,
  ProjectSource,
} from "@/content/projects";
import { useState } from "react";

export default function useProjects() {
  const [source, setSource] = useState<ProjectSource | undefined>();

  const [categories, setCategories] = useState<ProjectCategory[]>([]);

  const handleCategory = (category: ProjectCategory) => {
    setCategories(arrayToggle(categories, category));
  };

  const handleSource = (source: ProjectSource) => {
    setSource(source);
  };

  const projects = PROJECT_ITEMS
    // filter by source
    .filter((project) => {
      return source ? project.pse === (source === "pse") : true;
    })
    // filter by category
    .filter((project) => {
      return categories.length === 0
        ? true
        : categories.some((category) =>
            project?.categories?.includes(category)
          );
    });

  return {
    source,
    categories,
    projects,
    handleCategory,
    handleSource,
  };
}
