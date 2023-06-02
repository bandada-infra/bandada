/**
 * It returns a function that can be used to fetch users' data
 * with the API of the providers supported by Bandada.
 * @param baseURL The API base URL.
 * @param authorizationHeader The value of the 'Authorization' header.
 * @returns The function used to fetch API data.
 */
export default function getAPI(baseURL: string, authorizationHeader: string) {
    return async (endpoint: string) => {
        const headers = new Headers({
            Authorization: authorizationHeader
        })

        const userResponse = await fetch(`${baseURL}/${endpoint}`, {
            headers
        })

        return userResponse.json()
    }
}
