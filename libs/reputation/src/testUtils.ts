/* istanbul ignore file */
if (process.env.NODE_ENV === "test") {
    jest.mock("@bandada/utils", () => ({
        __esModule: true,
        request: jest.fn(() => Promise.resolve({}))
    }))
}

// eslint-disable-next-line import/first
import { request } from "@bandada/utils"

const requestMocked = request as jest.MockedFunction<typeof request>

/**
 * It mocks the 'request' implementation with Jest.
 * @param response The API response.
 */
export function mockAPI(response: any) {
    requestMocked.mockImplementation(() => Promise.resolve(response))
}

/**
 * It mocks the 'request' implementation with Jest, only once.
 * @param response The API response.
 */
export function mockAPIOnce(response: any) {
    requestMocked.mockImplementationOnce(() => Promise.resolve(response))
}
