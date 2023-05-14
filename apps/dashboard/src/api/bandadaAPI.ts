import { request } from "@bandada/utils"
import { SiweMessage } from "siwe"
import { Group } from "../types/groups"

const API_URL = import.meta.env.VITE_API_URL
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL

export async function generateMagicLink(
    groupId: string
): Promise<string | null> {
    try {
        const code = await request(`${API_URL}/invites`, {
            method: "post",
            data: {
                groupId
            }
        })

        return `${CLIENT_URL}/invites/${code}`
    } catch (error) {
        console.error(error)

        return null
    }
}

export async function getGroups(adminId: string): Promise<Group[] | null> {
    try {
        return await request(`${API_URL}/groups/?adminId=${adminId}`)
    } catch (error) {
        console.error(error)

        return null
    }
}

export async function getGroup(groupId: string): Promise<Group | null> {
    try {
        return await request(`${API_URL}/groups/${groupId}`)
    } catch (error) {
        console.error(error)

        return null
    }
}

export async function createGroup(
    name: string,
    description: string,
    treeDepth: number
): Promise<void | null> {
    try {
        await request(`${API_URL}/groups`, {
            method: "post",
            data: {
                name,
                description,
                treeDepth
            }
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

export async function removeMember(
    groupId: string,
    memberId: string
): Promise<void | null> {
    try {
        await request(`${API_URL}/groups/${groupId}/members/${memberId}`, {
            method: "delete"
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

export async function updateGroup(
    groupId: string,
    { apiEnabled }: { apiEnabled: boolean }
) {
    try {
        return (await request(`${API_URL}/groups/${groupId}`, {
            method: "PUT",
            data: { apiEnabled }
        })) as Group
    } catch (error) {
        console.error(error)
    }
}

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
