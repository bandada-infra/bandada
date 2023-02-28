import { request } from "@zk-groups/utils"
import { useCallback } from "react"
import { Group } from "../types/groups"

type ReturnParameters = {
    getGroup: (groupId: string) => Promise<Group | null>
    getMembersList: (groupId: string) => Promise<string[] | null>
}

export default function useMembers(): ReturnParameters {
    const getGroup = useCallback(
        async (groupId: string): Promise<Group | null> => {
            try {
                const groupList = await request(
                    `${import.meta.env.VITE_API_URL}/groups/${groupId}`
                )
                return groupList
            } catch (e) {
                return null
            }
        },
        []
    )

    const getMembersList = useCallback(
        async (groupId: string): Promise<string[] | null> => {
            const group = await getGroup(groupId)
            const membersList = group?.members
            if (membersList) {
                return membersList
            }

            return null
        },
        [getGroup]
    )

    return {
        getGroup,
        getMembersList
    }
}
