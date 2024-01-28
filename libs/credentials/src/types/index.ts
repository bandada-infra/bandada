import { BigNumberish } from "ethers"

export type Web2Context = {
    utils?: {
        api: (endpoint: string) => Promise<any>
    }
    profile: any
    accessTokens: {
        [provider: string]: string
    }
}

export type BlockchainContext = {
    address: BigNumberish
    jsonRpcProvider: any
    blockNumber?: bigint
}

export type Context = Web2Context | BlockchainContext

export type Handler = (criteria: any, context: Context) => Promise<boolean>

export interface Provider {
    name: string
}

export interface Web2Provider extends Provider {
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

export interface BlockchainProvider extends Provider {
    getAddress: (message: string, signature: string) => Promise<BigNumberish>
    getJsonRpcProvider: (url: string) => Promise<any>
}

export interface Validator {
    id: string
    criteriaABI: any
    validate: Handler
}

export type Credentials = {
    id: string
    criteria: any
}
