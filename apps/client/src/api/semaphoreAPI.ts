import { SemaphoreSubgraph } from "@semaphore-protocol/data"

const ETHEREUM_NETWORK = import.meta.env.VITE_ETHEREUM_NETWORK

const subgraph = new SemaphoreSubgraph(ETHEREUM_NETWORK)

/**
 * It returns details of a specific on-chain group.
 * @param groupId The group id.
 * @returns The group details.
 */
export async function getGroup(groupId: string) {
    try {
        const group = await subgraph.getGroup(groupId, {
            members: true
        })

        return {
            id: group.id,
            name: group.id,
            treeDepth: group.merkleTree.depth,
            fingerprintDuration: 3600,
            members: group.members as string[],
            admin: group.admin as string,
            type: "on-chain"
        }
    } catch (error) {
        console.error(error)

        return null
    }
}
