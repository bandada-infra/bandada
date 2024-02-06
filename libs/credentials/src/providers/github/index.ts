import { request } from "@bandada/utils"
import { Web2Provider } from "../.."

const provider: Web2Provider = {
    name: "github",
    apiURL: "https://api.github.com",

    getAuthUrl(clientId: string, state: string): string {
        return `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}`
    },

    async getAccessToken(
        clientId: string,
        clientSecret: string,
        code: string
    ): Promise<string> {
        const data = await request(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                data: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code
                }
            }
        )

        return new URLSearchParams(data).get("access_token") as string
    },

    async getProfile(accessToken: string): Promise<any> {
        return request(`${this.apiURL}/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}

export default provider
