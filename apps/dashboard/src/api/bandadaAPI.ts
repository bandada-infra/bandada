import { request } from "@bandada/utils"
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

export async function getGroups(): Promise<Group[] | null> {
    try {
        return await request(`${API_URL}/groups/admin-groups`)
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
        return null
    }
}

export async function removeMember(groupId: string, memberId: string) {
    try {
        await request(`${API_URL}/groups/${groupId}/${memberId}`, {
            method: "delete"
        })
    } catch (error) {
        console.error(error)
    }
}

export async function logOut(): Promise<void | null> {
    try {
        // TODO: check if this works properly.
        await request(`${API_URL}/auth/log-out`, {
            method: "post"
        })
    } catch (error) {
        console.error(error)

        return null
    }
}

export async function isLoggedIn(): Promise<boolean> {
    try {
        return await request(`${import.meta.env.VITE_API_URL}/auth/getUser`)
    } catch (error) {
        return false
    }
}
