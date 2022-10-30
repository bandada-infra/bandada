import { useCallback } from "react"
import { environment } from "src/environments/environment"
import { request } from "@utils"
import { Invite } from "src/types/invite"

type ReturnParameters = {
    validateCode: (inviteCode: string | undefined) => Promise<Invite>
    redeemInvite: (inviteCode: string | undefined) => Promise<void>
}

export default function usePermissionedGroups(): ReturnParameters {
    const validateCode = useCallback(
        async (inviteCode: string | undefined): Promise<Invite> => {
            const codeInfo = await request(
                `${environment.apiUrl}/invites/${inviteCode}`
            )

            return codeInfo
        },
        []
    )

    const redeemInvite = useCallback(
        async (inviteCode: string | undefined): Promise<void> => {
            await request(
                `${environment.apiUrl}/invites/redeem/${inviteCode}`,
                {
                    method: "post"
                }
            )
        },
        []
    )

    return {
        validateCode,
        redeemInvite
    }
}
