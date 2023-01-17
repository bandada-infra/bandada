import { Subgraph } from "@semaphore-protocol/subgraph"
import { getAddress } from "ethers/lib/utils"
import { useCallback } from "react"
import { Group } from "../types/groups"

type ReturnParameters = {
    getOnchainGroupList: (admin: string) => Promise<Group[] | null>
    getOnchainGroup: (groupName: string) => Promise<Group | null>
}

export default function useOnchainGroups(): ReturnParameters {
    const getOnchainGroupList = useCallback(
        async (admin: string): Promise<Group[] | null> => {
            try {
                const subgraph = new Subgraph()

                const groups = await subgraph.getGroups({ members: true })

                return groups
                    .filter(
                        (group) => getAddress(group.admin) === getAddress(admin)
                    )
                    .map((group) => {
                        return {
                            name: group.id, // TODO: convert to string
                            description: `${group.id} on-chain group`,
                            treeDepth: group.merkleTree.depth,
                            members: group.members,
                            admin: group.admin
                        }
                    })
            } catch (error) {
                console.log(error)
                return null
            }
        },
        []
    )
    const getOnchainGroup = useCallback(
        async (groupName: string): Promise<Group | null> => {
            try {
                const subgraph = new Subgraph()

                const group = await subgraph.getGroup(groupName, {
                    members: true
                })

                return {
                    name: groupName,
                    description: `${groupName} on-chain group`,
                    treeDepth: group.merkleTree.depth,
                    members: group.members,
                    admin: group.admin
                }
            } catch (error) {
                console.log(error)
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
