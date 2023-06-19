import { request } from "@bandada/utils"
import { OAuthProvider } from "../reputation/types"

/**
 * It returns the id of a OAuth account.
 * @param oAuthProvider OAuth provider.
 * @param accessToken OAuth access token.
 * @returns The OAuth account id.
 */
export default async function getOAuthAccountId(
    oAuthProvider: OAuthProvider,
    accessToken: string
): Promise<string> {
    switch (oAuthProvider) {
        case "github": {
            const { id } = await request("https://api.github.com/user", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            return id
        }
        case "twitter": {
            const { data } = await request(
                "https://api.twitter.com/2/users/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            return data.id
        }
        default:
            throw new Error(`OAuth provider ${oAuthProvider} does not exist`)
    }
}
