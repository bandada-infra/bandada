export type CriteriaName = "GITHUB_FOLLOWERS"

export type Criteria = {
    name: CriteriaName | string
    parameters: any
}

export type Context = {
    utils?: {
        checkParameterTypes: (parameters: any, types: any) => void
        githubAPI?: (endpoint: string) => Promise<any>
        twitterAPI?: (endpoint: string) => Promise<any>
        redditAPI?: (endpoint: string) => Promise<any>
    }
    githubAccessToken?: string
    twitterAccessToken?: string
    redditAccessToken?: string
}

export type Handler = (
    parameters: any,
    context: Context | { [key: string]: any }
) => Promise<boolean>
