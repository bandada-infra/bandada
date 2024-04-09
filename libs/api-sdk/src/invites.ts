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
