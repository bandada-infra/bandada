import { useCallback } from "react"
import { Group } from "src/types/groups"

const mockGroupList: Group[] = []

type ReturnParameters = {
    getGroupList: () => Promise<Group[] | null>
    createGroup: (
        groupName: string,
        groupDescription: string,
        groupSize: string
    ) => Promise<true | null>
}

export default function useGroups(): ReturnParameters {
    const getGroupList = useCallback(async (): Promise<Group[] | null> => {
        return mockGroupList
    }, [])

    const createGroup = useCallback(
        async (
            groupName: string,
            groupDescription: string,
            groupSize: string
        ): Promise<true | null> => {
            const newGroup: Group = {
                name: groupName,
                description: groupDescription,
                size: groupSize,
                members: []
            }
            try {
                const groupList = await getGroupList()
                groupList?.push(newGroup)
            } catch (error) {
                console.error(error)
            }

            return true
        },
        [getGroupList]
    )

    return {
        getGroupList,
        createGroup
    }
}
