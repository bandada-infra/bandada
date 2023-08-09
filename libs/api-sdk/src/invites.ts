import { request } from "@bandada/utils"
import { InviteResponse } from "./types"

let url = "/invites"

const config = {
    headers: {
        "Content-Type": "application/json"
    },
    baseURL:
        process.env.NODE_ENV === "test"
            ? "http://localhost:3000"
            : /* istanbul ignore next */
              "https://api.bandada.appliedzkp.org/"
}

/**
 * Returns a specific invite.
 * @param inviteCode Invite code.
 * @returns Specific invite.
 */
export async function getInvite(inviteCode: string): Promise<InviteResponse> {
    url += `/${inviteCode}`

    const invite = await request(url, config)

    return invite
}
