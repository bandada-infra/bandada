export type ReputationType =
    | "TWITTER_FOLLOWERS"
    | "GITHUB_FOLLOWERS"
    | "REDDIT_KARMA"

export type ReputationCriteria = {
    type: ReputationType | string
    parameters: any
}

export type ReputationContext = {
    utils?: {
        githubAPI?: (endpoint: string) => Promise<any>
        twitterAPI?: (endpoint: string) => Promise<any>
        redditAPI?: (endpoint: string) => Promise<any>
    }
    githubAccessToken?: string
    twitterAccessToken?: string
    redditAccessToken?: string
}

export type ReputationHandler = (
    parameters: any,
    context: ReputationContext | { [key: string]: any }
) => Promise<boolean>
