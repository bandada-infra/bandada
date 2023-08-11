import { request } from "@bandada/utils"
import { InviteResponse } from "./types"

const url = "/invites"

/**
 * Returns a specific invite.
 * @param inviteCode Invite code.
 * @returns Specific invite.
 */
export async function getInvite(
    config: object,
    inviteCode: string
): Promise<InviteResponse> {
    const requestUrl = `${url}/${inviteCode}`

    const invite = await request(requestUrl, config)

    invite.group.credentials = JSON.parse(invite.group.credentials)

    return invite
}
