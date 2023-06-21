import { request } from "@bandada/utils"

/**
 * It returns a function that can be used to fetch users' data
 * with the API of the providers supported by Bandada.
 * @param baseUrl The API base URL.
 * @param accesstoken The provider access token.
 * @returns The function used to fetch API data.
 */
export default function getAPI(baseUrl: string, accesstoken: string) {
    return async (endpoint: string) =>
        request(`${baseUrl}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${accesstoken}`
            }
        })
}
