import { request } from "@bandada/utils"
import { Invite } from "./types"

const url = "/invites"

/**
 * Returns a specific invite.
 * @param inviteCode Invite code.
 * @returns Specific invite.
 */
export async function getInvite(
    config: object,
    inviteCode: string
): Promise<Invite> {
    const requestUrl = `${url}/${inviteCode}`

    const invite = await request(requestUrl, config)

    invite.group.credentials = JSON.parse(invite.group.credentials)

    return invite
}

/**
 * Returns boolean value if the invite code is valid.
 * @param inviteCode Invite code.
 * @param groupId Group id.
 * @returns Boolean.
 */
export async function checkInvite(
    config: object,
    inviteCode: string,
    groupId: string
): Promise<boolean> {
    const requestUrl = `${url}/check/${inviteCode}/group/${groupId}`

    const req = await request(requestUrl, config)

    return req
}

/**
 * Creates one new group invite.
 * @param groupId The group identifier.
 * @param apiKey API Key of the admin.
 * @returns Invite.
 */
export async function createInvite(
    config: object,
    groupId: string,
    apiKey: string
): Promise<Invite> {
    const newConfig: any = {
        method: "post",
        data: {
            groupId
        },
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    const req = await request(url, newConfig)

    return req
}

/**
 * Redeems a specific invite.
 * @param inviteCode Invite code to be redeemed.
 * @param groupId Group id.
 * @param apiKey API Key of the admin.
 * @returns The updated redeemed invite.
 */
export async function redeemInvite(
    config: object,
    inviteCode: string,
    groupId: string,
    apiKey: string
): Promise<Invite> {
    const requestUrl = `${url}/redeem`

    const newConfig: any = {
        method: "patch",
        data: {
            inviteCode,
            groupId
        },
        ...config
    }

    newConfig.headers["x-api-key"] = apiKey

    const req = await request(requestUrl, newConfig)

    return req
}
