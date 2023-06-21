export type Context = {
    utils: {
        api: (endpoint: string) => Promise<any>
    }
    profile: any
    accessTokens: {
        [provider: string]: string
    }
}

export type Handler = (criteria: any, context: Context) => Promise<boolean>

export interface Provider {
    name: string
    apiURL: string
    getAuthUrl: (clientId: string, state: string, redirectUri: string) => string
    getAccessToken: (
        clientId: string,
        clientSecret: string,
        code: string,
        state: string,
        redirectUri: string
    ) => Promise<string>
    getProfile: (accessToken: string) => Promise<any>
}

export interface Validator {
    id: string
    criteriaABI: any
    validate: Handler
}

export type ReputationCriteria = {
    id: string
    criteria: any
}
