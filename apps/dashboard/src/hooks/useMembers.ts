import { useCallback } from "react"
import { Group } from "src/types/groups"
import { Member } from "src/types/members"
import useGroups from "./useGroups"

const mockGroup: Group = {
    name: "test-group",
    description: "this is the test group",
    size: "large",
    members: [
        { identityCommitment: "0x38d8df0bC28630033E8cf527c976aBD448AeFB89" },
        { identityCommitment: "0x38d8df0bC28630033E8cf527c976aBD448AeFB89" },
        { identityCommitment: "0x38d8df0bC28630033E8cf527c976aBD448AeFB89" },
        { identityCommitment: "0x38d8df0bC28630033E8cf527c976aBD448AeFB89" },
        { identityCommitment: "0x38d8df0bC28630033E8cf527c976aBD448AeFB89" }
    ]
}

type ReturnParameters = {
    getGroup: (groupName: string) => Promise<Group | null>
    getMembersList: (groupName: string) => Promise<Member[] | null>
}

export default function useMembers(): ReturnParameters {
    const { getGroupList } = useGroups()

    const getGroup = useCallback(
        async (groupName: string): Promise<Group | null> => {
            const groupList = await getGroupList()
            // const filteredGroup = groupList?.filter(
            //     (group) => group.name === groupName
            // )
            // if (filteredGroup) {
            //     return filteredGroup[0]
            // } else {
            //     return null
            // }
            return mockGroup
        },
        [getGroupList]
    )

    const getMembersList = useCallback(
        async (groupName: string): Promise<Member[] | null> => {
            const group = await getGroup(groupName)
            const membersList = group?.members
            return mockGroup.members
        },
        [getGroup]
    )

    return {
        getGroup,
        getMembersList
    }
}
