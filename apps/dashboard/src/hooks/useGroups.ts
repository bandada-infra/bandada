import { useCallback } from "react"
import { Group } from "src/types/groups"
import request from "src/utils/request"
import { AxiosRequestConfig } from "axios"

type ReturnParameters = {
    getGroupList: () => Promise<Group[] | null>
    createGroup: (
        groupName: string,
        groupDescription: string,
        groupTreeDepth: number
    ) => Promise<true | null>
}

export default function useGroups(): ReturnParameters {
    const getGroupList = useCallback(async (): Promise<Group[] | null> => {
        const groupList = await request("http://localhost:3333/api/groups")
        return groupList
    }, [])

    const createGroup = useCallback(
        async (
            groupName: string,
            groupDescription: string,
            groupTreeDepth: number
        ): Promise<true | null> => {
            const config: AxiosRequestConfig = {
                method: "post",
                data: {
                    name: groupName,
                    description: groupDescription,
                    treeDepth: groupTreeDepth
                }
            }
            await request("http://localhost:3333/api/groups", config)

            return true
        },
        []
    )

    return {
        getGroupList,
        createGroup
    }
}
