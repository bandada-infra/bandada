import { Identity } from "@semaphore-protocol/identity"
import { request } from "@utils"
import { Signer } from "ethers"
import { useCallback, useState } from "react"
import { environment } from "src/environments/environment"
import { Invite } from "src/types/invite"

type ReturnParameters = {
    getInvite: (inviteCode: string | undefined) => Promise<Invite>
    generateIdentityCommitment: (
        signer: Signer,
        groupName: string
    ) => Promise<string | null>
    addMember: (
        groupName: string,
        idCommitment: string,
        inviteCode: string
    ) => Promise<void>
    hasjoined: boolean
    loading: boolean
}

export default function usePermissionedGroups(): ReturnParameters {
    const [_loading, setLoading] = useState<boolean>(false)
    const [_hasJoined, setHasjoined] = useState<boolean>(false)

    const getInvite = useCallback(
        async (inviteCode: string | undefined): Promise<Invite> => {
            const codeInfo = await request(
                `${environment.apiUrl}/invites/${inviteCode}`
            )

            return codeInfo
        },
        []
    )

    const generateIdentityCommitment = useCallback(
        async (signer: Signer, groupName: string): Promise<string | null> => {
            setLoading(true)
            const nonce = 0
            const message = `Sign this message to generate your ${groupName} Semaphore identity with key nonce: ${nonce}.`
            const identity = new Identity(await signer.signMessage(message))
            const identityCommitment = identity.getCommitment().toString()
            const hasJoined = await request(
                `${environment.apiUrl}/groups/${groupName}/${identityCommitment}`
            )
            setHasjoined(hasJoined)
            setLoading(false)
            return identityCommitment
        },
        []
    )

    const addMember = useCallback(
        async (
            groupName: string,
            idCommitment: string,
            inviteCode: string
        ): Promise<void> => {
            await request(
                `${environment.apiUrl}/groups/${groupName}/${idCommitment}`,
                {
                    method: "post",
                    data: {
                        inviteCode
                    }
                }
            )
        },
        []
    )

    return {
        getInvite,
        generateIdentityCommitment,
        addMember,
        hasjoined: _hasJoined,
        loading: _loading
    }
}
