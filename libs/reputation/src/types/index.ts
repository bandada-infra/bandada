export type Context = {
    utils?: {
        checkCriteria: (criteria: any, types: any) => void
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

export interface Validator {
    name: string
    criteriaABI: any
    validate: Handler
}

export type ReputationCriteria = any
