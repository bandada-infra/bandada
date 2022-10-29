import { useCallback } from "react"
import { Group } from "src/types/groups"
import request from "src/utils/request"
import { AxiosRequestConfig } from "axios"
import { environment } from "src/environments/environment"

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
        try {
            const groupList = await request(
                `${environment.apiUrl}/groups/admin-groups`
            )
            return groupList
        } catch (e) {
            return null
        }
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
            await request(`${environment.apiUrl}/groups`, config)

            return true
        },
        []
    )

    return {
        getGroupList,
        createGroup
    }
}
