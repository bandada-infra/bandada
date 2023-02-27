import { Subgraph } from "@semaphore-protocol/subgraph"
import { utils } from "ethers"
import { useCallback } from "react"
import { Group } from "../types/groups"

type ReturnParameters = {
    getOnchainGroupList: (admin: string) => Promise<Group[] | null>
    getOnchainGroup: (groupName: string) => Promise<Group | null>
}

function formatGroupName(groupNameInt: string) {
    try {
        return utils.toUtf8String(groupNameInt)
    } catch (error) {
        // If not parse-able as String, return original value
        return groupNameInt
    }
}

export default function useOnchainGroups(): ReturnParameters {
    const getOnchainGroupList = useCallback(
        async (admin: string): Promise<Group[] | null> => {
            try {
                const subgraph = new Subgraph("goerli")

                const groups = await subgraph.getGroups({
                    members: true,
                    filters: { admin }
                })

                return groups.map((group) => {
                    const groupName = formatGroupName(group.id)

                    return {
                        name: groupName,
                        description: "",
                        treeDepth: group.merkleTree.depth,
                        members: group.members as string[],
                        admin: group.admin
                    }
                })
            } catch (error) {
                console.error(error)

                return null
            }
        },
        []
    )
    const getOnchainGroup = useCallback(
        async (groupName: string): Promise<Group | null> => {
            try {
                const subgraph = new Subgraph("goerli")

                const group = await subgraph.getGroup(groupName, {
                    members: true
                })

                return {
                    name: groupName,
                    description: "",
                    treeDepth: group.merkleTree.depth,
                    members: group.members as string[],
                    admin: group.admin
                }
            } catch (error) {
                console.error(error)

                return null
            }
        },
        []
    )
    return {
        getOnchainGroupList,
        getOnchainGroup
    }
}
