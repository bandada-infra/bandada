import { request } from "@bandada/utils"
import { SiweMessage } from "siwe"
import { Group } from "../types"

const API_URL = import.meta.env.VITE_API_URL
const CLIENT_URL = import.meta.env.VITE_CLIENT_INVITES_URL

/**
 * It generates a magic link with a valid invite code
 * to allows users to join groups themselves.
 * The client URL must include a forbidden URL '\' character
 * which will be replaced by the invite code.
 * @param groupId The group id.
 * @param clientUrl The client URL.
 * @returns The magic link.
 */
export async function generateMagicLink(
    groupId: string,
    clientUrl?: string
): Promise<string | null> {
    try {
        const code = await request(`${API_URL}/invites`, {
            method: "POST",
            data: {
                groupId
            }
        })

        return (clientUrl || CLIENT_URL).replace("\\", code)
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It returns the list of groups for a specific admin.
 * @param adminId The admin id.
 * @returns The list of groups or null.
 */
export async function getGroups(adminId: string): Promise<Group[] | null> {
    try {
        const groups = await request(`${API_URL}/groups/?adminId=${adminId}`)

        return groups.map((group: Group) => ({
            ...group,
            type: "off-chain"
        }))
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It returns details of a specific group.
 * @param groupId The group id.
 * @returns The group details.
 */
export async function getGroup(groupId: string): Promise<Group | null> {
    try {
        const group = await request(`${API_URL}/groups/${groupId}`)

        return { ...group, type: "off-chain" }
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It creates a new group.
 * @param name The group name.
 * @param description The group description.
 * @param treeDepth The Merkle tree depth.
 * @returns The group details.
 */
export async function createGroup(
    name: string,
    description: string,
    treeDepth: number,
    fingerprintDuration: number
): Promise<Group | null> {
    try {
        const group = await request(`${API_URL}/groups`, {
            method: "POST",
            data: {
                name,
                description,
                treeDepth,
                fingerprintDuration
            }
        })

        return { ...group, type: "off-chain" }
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It updates the detail of a group.
 * @param group The group id.
 * @param memberId The group member id.
 */
export async function updateGroup(
    groupId: string,
    { apiEnabled }: { apiEnabled: boolean }
): Promise<Group | null> {
    try {
        const group = await request(`${API_URL}/groups/${groupId}`, {
            method: "PATCH",
            data: { apiEnabled }
        })

        return { ...group, type: "off-chain" }
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It adds a new member to an existing group.
 * @param group The group id.
 * @param memberId The group member id.
 */
export async function addMember(
    groupId: string,
    memberId: string
): Promise<void | null> {
    try {
        await request(`${API_URL}/groups/${groupId}/members`, {
            method: "POST",
            data: {
                id: memberId
            }
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It removes a member from a group.
 * @param group The group id.
 * @param memberId The group member id.
 */
export async function removeMember(
    groupId: string,
    memberId: string
): Promise<void | null> {
    try {
        await request(`${API_URL}/groups/${groupId}/members/${memberId}`, {
            method: "DELETE"
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It returns a SIWE nonce for authentication, used to prevent replay attacks.
 * @returns The SIWE nonce.
 */
export async function getNonce(): Promise<string | null> {
    try {
        return await request(`${API_URL}/auth/nonce`, {
            method: "GET"
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It allows admins to authenticate.
 * @param message The SIWE message.
 * @param signature The SIWE signature of the message.
 * @returns The admin details.
 */
export async function signIn({
    message,
    signature
}: {
    message: SiweMessage
    signature: string
}): Promise<any | null> {
    try {
        return await request(`${API_URL}/auth`, {
            method: "POST",
            data: {
                message: message.toMessage(),
                signature
            }
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

/**
 * It allows admins to log out.
 */
export async function logOut(): Promise<void | null> {
    try {
        await request(`${API_URL}/auth`, {
            method: "DELETE"
        })
    } catch (error) {
        console.error(error)

        return null
    }
}
