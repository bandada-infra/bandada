import { request } from "@bandada/utils"
import { InviteResponse } from "./types"
import { config } from "./config"

const url = "/invites"

/**
 * Returns a specific invite.
 * @param inviteCode Invite code.
 * @returns Specific invite.
 */
export async function getInvite(inviteCode: string): Promise<InviteResponse> {
    const requestUrl = `${url}/${inviteCode}`

    const invite = await request(requestUrl, config)

    return invite
}
