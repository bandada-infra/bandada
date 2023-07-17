import { GroupResponse } from "./types"
import { request } from "@bandada/utils"

let url = "/groups"

const config = {
    headers: {
        "Content-Type": "application/json"
    },
    baseURL: "http://localhost:3000"
}

/**
 * Returns the list of groups.
 * @returns List of groups.
 */
export async function getGroups(): Promise<GroupResponse[]> {
    const groups = await request(url, config)

    console.log(groups)

    return groups
}

/**
 * Returns a specific group.
 * @param groupId Group id.
 * @returns Specific group.
 */
export async function getGroup(groupId: string): Promise<GroupResponse> {
    url += `/${groupId}`

    return await request(url, config)
}
