import { request } from "@zk-groups/utils"
import { useCallback } from "react"
import { Group } from "../types/groups"

type ReturnParameters = {
    getGroup: (groupName: string) => Promise<Group | null>
    getMembersList: (groupName: string) => Promise<string[] | null>
}

export default function useMembers(): ReturnParameters {
    const getGroup = useCallback(
        async (groupName: string): Promise<Group | null> => {
            try {
                const groupList = await request(
                    `${process.env.NX_API_URL}/groups/${groupName}`
                )
                return groupList
            } catch (e) {
                return null
            }
        },
        []
    )

    const getMembersList = useCallback(
        async (groupName: string): Promise<string[] | null> => {
            const group = await getGroup(groupName)
            const membersList = group?.members
            if (membersList) {
                return membersList
            } else {
                return null
            }
        },
        [getGroup]
    )

    return {
        getGroup,
        getMembersList
    }
}
