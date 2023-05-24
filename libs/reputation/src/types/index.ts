export type ValidatorName = "GITHUB_FOLLOWERS"

export type Validator = {
    name: ValidatorName | string
    criteria: any
}

export type Context = {
    utils?: {
        checkCriteriaTypes: (criteria: any, types: any) => void
        githubAPI?: (endpoint: string) => Promise<any>
        twitterAPI?: (endpoint: string) => Promise<any>
        redditAPI?: (endpoint: string) => Promise<any>
    }
    githubAccessToken?: string
    twitterAccessToken?: string
    redditAccessToken?: string
}

export type Handler = (
    criteria: any,
    context: Context | { [key: string]: any }
) => Promise<boolean>
