import { request } from "@bandada/utils"
import { GroupResponse } from "./types"

let url = "/groups"

const config = {
    headers: {
        "Content-Type": "application/json"
    },
    baseURL:
        process.env.NODE_ENV === "test"
            ? "http://localhost:3000"
            : "https://api.bandada.appliedzkp.org/"
}

/**
 * Returns the list of groups.
 * @returns List of groups.
 */
export async function getGroups(): Promise<GroupResponse[]> {
    const groups = await request(url, config)

    return groups
}

/**
 * Returns a specific group.
 * @param groupId Group id.
 * @returns Specific group.
 */
export async function getGroup(groupId: string): Promise<GroupResponse> {
    url += `/${groupId}`

    const group = await request(url, config)

    return group
}

/**
 * Returns true if the member is in the group and false otherwise.
 * @param groupId Group id.
 * @param memberId Member id.
 * @returns true or false.
 */
export async function isGroupMember(
    groupId: string,
    memberId: string
): Promise<boolean> {
    url += `/${groupId}/members/${memberId}`

    const isMember = await request(url, config)

    return isMember
}

/**
 * Returns the Merkle Proof for a member in a group.
 * @param groupId Group id.
 * @param memberId Member id.
 * @returns the Merkle Proof.
 */
export async function generateMerkleProof(
    groupId: string,
    memberId: string
): Promise<string> {
    url += `/${groupId}/members/${memberId}/proof`

    const merkleProof = await request(url, config)

    return merkleProof
}

/**
 * Adds a member to a group using an API Key.
 * @param groupId Group id.
 * @param memberId Member id.
 * @param apiKey API Key.
 * @returns undefined.
 */
export async function addMemberByApiKey(
    groupId: string,
    memberId: string,
    apiKey: string
): Promise<void> {
    url += `/${groupId}/members/${memberId}`

    const newConfig: any = {
        method: "post",
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    await request(url, newConfig)
}

/**
 * Adds a member to a group using an Invite Code.
 * @param groupId Group id.
 * @param memberId Member id.
 * @param inviteCode Invite Code.
 * @returns undefined.
 */
export async function addMemberByInviteCode(
    groupId: string,
    memberId: string,
    inviteCode: string
): Promise<void> {
    url += `/${groupId}/members/${memberId}`

    await request(url, {
        method: "post",
        data: {
            inviteCode
        }
    })
}

/**
 * Removes a member from a group using an API Key.
 * @param groupId Group id.
 * @param memberId Member id.
 * @param apiKey API Key.
 * @returns undefined.
 */
export async function removeMemberByApiKey(
    groupId: string,
    memberId: string,
    apiKey: string
): Promise<void> {
    url += `/${groupId}/members/${memberId}`

    const newConfig: any = {
        method: "delete",
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    await request(url, newConfig)
}
