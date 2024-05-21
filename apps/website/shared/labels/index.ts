import { BUILD_PAGE_LABELS } from "./buildPage.labels"
import { HOMEPAGE_LABELS } from "./homepage"
import { PROJECTS_PAGE_LABELS } from "./projectsPage.labels"

export const LABELS = {
    HOMEPAGE: HOMEPAGE_LABELS,
    BUILD: BUILD_PAGE_LABELS,
    PROJECTS: PROJECTS_PAGE_LABELS,
    FOOTER: {
        COPYRIGHT: `Copyright © ${new Date().getFullYear()} Ethereum Foundation`,
        FEEDBACK: "Give feedback about the website"
    },
    COMMON: {
        VIEW_MORE: "View more",
        SUBMIT_PROJECT: "Submit your project",
        SHOW_MORE: "Show more",
        SHOW_LESS: "Show less",
        CATEGORY: "Category",
        NO_RESULT: "No result found.",
        NO_RESULT_DESCRIPTION:
            "No projects matching these filters. Try changing your search.",
        GET_INSPIRED: "Get inspired",
        READ_TIME: "min read",
        LAUNCH_APP: "Launch app",
        DISCORD: "Discord",
        VIDEOS: "Videos",
        ARTICLES: "Articles",
        GO_TO_HOME: "Go to home"
    }
}
