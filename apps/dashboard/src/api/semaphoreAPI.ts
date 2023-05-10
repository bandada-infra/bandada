import { SemaphoreSubgraph } from "@semaphore-protocol/data"
import { BigNumber, utils } from "ethers"
import { Group } from "../types/groups"

const ETHEREUM_NETWORK = import.meta.env.VITE_ETHEREUM_NETWORK

const subgraph = new SemaphoreSubgraph(ETHEREUM_NETWORK)

function formatGroupName(groupNameInt: string) {
    try {
        return utils.parseBytes32String(
            BigNumber.from(groupNameInt).toHexString()
        )
    } catch (error) {
        // If not parse-able as String, return original value
        return groupNameInt
    }
}

export async function getGroups(admin: string): Promise<Group[] | null> {
    try {
        const groups = await subgraph.getGroups({
            members: true,
            filters: { admin }
        })

        return groups.map((group) => {
            const groupName = formatGroupName(group.id)

            return {
                id: group.id,
                name: groupName,
                description: "",
                treeDepth: group.merkleTree.depth,
                members: group.members as string[],
                admin: group.admin as string
            }
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

export async function getGroup(groupId: string): Promise<Group | null> {
    try {
        const group = await subgraph.getGroup(groupId, {
            members: true
        })

        return {
            id: group.id,
            name: formatGroupName(group.id),
            description: "",
            treeDepth: group.merkleTree.depth,
            members: group.members as string[],
            admin: group.admin as string
        }
    } catch (error) {
        console.error(error)

        return null
    }
}
