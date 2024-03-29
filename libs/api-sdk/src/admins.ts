import { request } from "@bandada/utils"
import { AdminRequest, AdminResponse, AdminUpdateApiKeyRequest } from "./types"

const url = "/admins"

/**
 * Create an admin with the provided details.
 * @param dto Array of objects containing the details for the admin to be created.
 * @returns Array of  the created groups.
 */
export async function createAdmin(
    config: object,
    dto: AdminRequest
): Promise<AdminResponse> {
    const newConfig: any = {
        method: "post",
        data: {
            dto
        },
        ...config
    }

    return request(url, newConfig)
}

/**
 * Get an admin.
 * @param adminId The admin id.
 * @returns The admin with given id.
 */
export async function getAdmin(
    config: object,
    adminId: string
): Promise<AdminResponse> {
    const requestUrl = `${url}/${adminId}`

    const newConfig: any = {
        method: "get",
        ...config
    }

    return request(requestUrl, newConfig)
}

/**
 * Update an admin API key.
 * @param adminId The admin id.
 * @param dto The action to be executed on the API key.
 * @returns The updated API key.
 */
export async function updateApiKey(
    config: object,
    adminId: string,
    dto: AdminUpdateApiKeyRequest
): Promise<string> {
    const requestUrl = `${url}/${adminId}/apikey`

    const newConfig: any = {
        method: "put",
        body: {
            adminId,
            dto
        },
        ...config
    }

    return request(requestUrl, newConfig)
}
