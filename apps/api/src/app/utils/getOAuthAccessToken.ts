import { request } from "@bandada/utils"
import { OAuthProvider } from "../reputation/types"

/**
 * It returns the access token for a given OAuth provider.
 * @param oAuthProvider OAuth provider.
 * @param oAuthCode OAuth code to exchange.
 * @returns The access token.
 */
export default async function getOAuthAccessToken(
    oAuthProvider: OAuthProvider,
    oAuthCode: string,
    oAuthState?: string
): Promise<string> {
    switch (oAuthProvider) {
        case "github": {
            const response = await request(
                "https://github.com/login/oauth/access_token",
                {
                    method: "POST",
                    data: {
                        client_id: process.env.GITHUB_CLIENT_ID,
                        client_secret: process.env.GITHUB_CLIENT_SECRET,
                        code: oAuthCode
                    }
                }
            )

            return new URLSearchParams(response).get("access_token")
        }
        case "twitter": {
            const response = await request(
                "https://api.twitter.com/2/oauth2/token",
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${Buffer.from(
                            `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
                        ).toString("base64")}`
                    },
                    method: "POST",
                    data:
                        `redirect_uri=${process.env.TWITTER_REDIRECT_URI}&` +
                        `grant_type=authorization_code&` +
                        `code_verifier=${oAuthState}&` +
                        `code=${oAuthCode}`
                }
            )

            return response.access_token
        }
        default:
            throw new Error(`OAuth provider ${oAuthProvider} does not exist`)
    }
}
