export default function request(baseUrl: string, authorizationHeader: string) {
    return async (endpoint: string) => {
        const headers = new Headers({
            Authorization: authorizationHeader
        })

        const userResponse = await fetch(`${baseUrl}/${endpoint}`, {
            headers
        })

        return userResponse.json()
    }
}
