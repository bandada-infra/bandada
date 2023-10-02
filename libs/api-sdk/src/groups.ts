import { request } from "@bandada/utils"
import { GroupResponse } from "./types"

const url = "/groups"

/**
 * Returns the list of groups.
 * @returns List of groups.
 */
export async function getGroups(config: object): Promise<GroupResponse[]> {
    const groups = await request(url, config)

    groups.map((group: any) => ({
        ...group,
        credentials: JSON.parse(group.credentials)
    }))

    return groups
}

/**
 * Returns a specific group.
 * @param groupId Group id.
 * @returns Specific group.
 */
export async function getGroup(
    config: object,
    groupId: string
): Promise<GroupResponse> {
    const requestUrl = `${url}/${groupId}`

    const group = await request(requestUrl, config)

    group.credentials = JSON.parse(group.credentials)

    return group
}

/**
 * Returns true if the member is in the group and false otherwise.
 * @param groupId Group id.
 * @param memberId Member id.
 * @returns true or false.
 */
export async function isGroupMember(
    config: object,
    groupId: string,
    memberId: string
): Promise<boolean> {
    const requestUrl = `${url}/${groupId}/members/${memberId}`

    const isMember = await request(requestUrl, config)

    return isMember
}

/**
 * Returns the Merkle Proof for a member in a group.
 * @param groupId Group id.
 * @param memberId Member id.
 * @returns the Merkle Proof.
 */
export async function generateMerkleProof(
    config: object,
    groupId: string,
    memberId: string
): Promise<string> {
    const requestUrl = `${url}/${groupId}/members/${memberId}/proof`

    const merkleProof = await request(requestUrl, config)

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
    config: object,
    groupId: string,
    memberId: string,
    apiKey: string
): Promise<void> {
    const requestUrl = `${url}/${groupId}/members/${memberId}`

    const newConfig: any = {
        method: "post",
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    await request(requestUrl, newConfig)
}

/**
 * Adds members to a group using an API Key.
 * @param groupId Group id.
 * @param memberIds Member ids.
 * @param apiKey API Key.
 * @returns undefined.
 */
export async function addMembersByApiKey(
    config: object,
    groupId: string,
    memberIds: string[],
    apiKey: string
): Promise<void> {
    const requestUrl = `${url}/${groupId}/members`

    const newConfig: any = {
        method: "post",
        data: {
            memberIds
        },
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    await request(requestUrl, newConfig)
}

/**
 * Adds a member to a group using an Invite Code.
 * @param groupId Group id.
 * @param memberId Member id.
 * @param inviteCode Invite Code.
 * @returns undefined.
 */
export async function addMemberByInviteCode(
    config: object,
    groupId: string,
    memberId: string,
    inviteCode: string
): Promise<void> {
    const requestUrl = `${url}/${groupId}/members/${memberId}`

    const newConfig: any = {
        method: "post",
        data: {
            inviteCode
        },
        ...config
    }

    await request(requestUrl, newConfig)
}

/**
 * Removes a member from a group using an API Key.
 * @param groupId Group id.
 * @param memberId Member id.
 * @param apiKey API Key.
 * @returns undefined.
 */
export async function removeMemberByApiKey(
    config: object,
    groupId: string,
    memberId: string,
    apiKey: string
): Promise<void> {
    const requestUrl = `${url}/${groupId}/members/${memberId}`

    const newConfig: any = {
        method: "delete",
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    await request(requestUrl, newConfig)
}

/**
 * Removes multiple members from a group using an API Key.
 * @param groupId Group id.
 * @param memberIds Member ids.
 * @param apiKey API Key.
 * @returns undefined.
 */
export async function removeMembersByApiKey(
    config: object,
    groupId: string,
    memberIds: string[],
    apiKey: string
): Promise<void> {
    const requestUrl = `${url}/${groupId}/members`

    const newConfig: any = {
        method: "delete",
        data: {
            memberIds
        },
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    await request(requestUrl, newConfig)
}
