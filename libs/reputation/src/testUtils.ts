/**
 * It mocks the 'fetch' implementation with Jest.
 * @param response The API response.
 */
export function mockAPIOnce(response: any) {
    ;(fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
            json: () => Promise.resolve(response)
        })
    )
}
