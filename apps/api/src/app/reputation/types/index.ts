export type OAuthProvider = "github" // | "twitter" | "reddit"

export type OAuthState = {
    groupId: string
    memberId: string
    provider: OAuthProvider
    redirectURI?: string
}
