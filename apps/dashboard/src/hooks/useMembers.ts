import { useCallback } from "react"
import { Group } from "src/types/groups"
import request from "src/utils/request"

type ReturnParameters = {
    getGroup: (groupName: string) => Promise<Group | null>
    getMembersList: (groupName: string) => Promise<string[] | null>
}

export default function useMembers(): ReturnParameters {
    const getGroup = useCallback(
        async (groupName: string): Promise<Group | null> => {
            const groupList = await request(
                `http://localhost:3333/api/groups/${groupName}`
            )
            return groupList
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
