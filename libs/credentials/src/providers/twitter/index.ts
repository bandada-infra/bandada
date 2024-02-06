import { request } from "@bandada/utils"
import { Web2Provider } from "../../types"

const provider: Web2Provider = {
    name: "twitter",
    apiURL: "https://api.twitter.com/2",

    getAuthUrl(clientId: string, state: string, redirectUri: string): string {
        return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&scope=users.read%20tweet.read%20follows.read%20like.read%20list.read&redirect_uri=${redirectUri}&state=${state}&code_challenge=${state}&code_challenge_method=plain`
    },

    async getAccessToken(
        clientId: string,
        clientSecret: string,
        code: string,
        state: string,
        redirectUri: string
    ): Promise<string> {
        const { data } = await request(
            "https://api.twitter.com/2/oauth2/token",
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${clientId}:${clientSecret}`
                    ).toString("base64")}`
                },
                method: "POST",
                data:
                    `redirect_uri=${redirectUri}&` +
                    `grant_type=authorization_code&` +
                    `code_verifier=${state}&` +
                    `code=${code}`
            }
        )

        return data.access_token
    },

    async getProfile(accessToken: string): Promise<any> {
        const { data } = await request(`${this.apiURL}/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return data
    }
}

export default provider
