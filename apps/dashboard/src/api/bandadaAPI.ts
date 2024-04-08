import { ApiKeyActions, request } from "@bandada/utils"
import { SiweMessage } from "siwe"
import { Admin, Group } from "../types"
import createAlert from "../utils/createAlert"

const API_URL = import.meta.env.VITE_API_URL
const CLIENT_INVITES_URL = import.meta.env.VITE_CLIENT_INVITES_URL

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
        const invite = await request(`${API_URL}/invites`, {
            method: "POST",
            data: {
                groupId
            }
        })

        return (clientUrl || CLIENT_INVITES_URL).replace("\\", invite.code)
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
    fingerprintDuration: number,
    credentials?: any
): Promise<Group | null> {
    try {
        const groups = await request(`${API_URL}/groups`, {
            method: "POST",
            data: [
                {
                    name,
                    description,
                    treeDepth,
                    fingerprintDuration,
                    credentials: JSON.stringify(credentials)
                }
            ]
        })

        return { ...groups.at(0), type: "off-chain" }
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It returns details of a specific admin.
 * @param adminId The admin id.
 * @returns The admin details.
 */
export async function getAdmin(adminId: string): Promise<Admin | null> {
    try {
        return await request(`${API_URL}/admins/${adminId}`)
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It works with the Admin API key.
 * @param adminId The admin id.
 * @param action The action to carry on the API key.
 */
export async function updateApiKey(
    adminId: string,
    action: ApiKeyActions
): Promise<string | null> {
    try {
        return await request(`${API_URL}/admins/${adminId}/apikey`, {
            method: "PUT",
            data: {
                action
            }
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It removes a group.
 * @param groupId The group id.
 */
export async function removeGroup(groupId: string): Promise<void | null> {
    try {
        await request(`${API_URL}/groups/${groupId}`, {
            method: "DELETE"
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It returns a random string to be used as a OAuth state, to to protect against
 * forgery attacks. It will be used to retrieve group, member, redirectURI and provider
 * before checking credentials and adding members.
 * @param group The group id.
 * @param memberId The group member id.
 * @param redirectUri The URL where clients will be sent after authorization.
 * @param providerName OAuth provider name.
 * @returns The OAuth state id.
 */
export async function setOAuthState(
    groupId: string,
    memberId: string,
    providerName: string,
    redirectUri?: string
): Promise<string | null> {
    try {
        return await request(`${API_URL}/credentials/oauth-state`, {
            method: "POST",
            data: {
                groupId,
                memberId,
                providerName,
                redirectUri
            }
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It adds a new member to an existing credentials group.
 * @param oAuthState The OAuth state.
 * @param oAuthCode The OAuth code.
 */
export async function addMemberByCredentials(
    oAuthState: string,
    oAuthCode?: string,
    address?: string
): Promise<string | null> {
    try {
        return await request(`${API_URL}/credentials`, {
            method: "POST",
            data: {
                oAuthState,
                oAuthCode,
                address
            }
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
        await request(`${API_URL}/groups/${groupId}/members/${memberId}`, {
            method: "POST"
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It adds new members to an existing group.
 * @param group The group id.
 * @param memberIds The array of group member ids.
 */
export async function addMembers(
    groupId: string,
    memberIds: string[]
): Promise<void | null> {
    try {
        await request(`${API_URL}/groups/${groupId}/members`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                memberIds
            })
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It removes members from a group.
 * @param group The group id.
 * @param memberIds The array of group member ids.
 */
export async function removeMembers(
    groupId: string,
    memberIds: string[]
): Promise<void | null> {
    try {
        await request(`${API_URL}/groups/${groupId}/members`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                memberIds
            })
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
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
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}

/**
 * It returns true if the admin is logged in, false otherwise.
 * @returns True or false.
 */
export async function isLoggedIn(): Promise<null | boolean> {
    try {
        return await request(`${API_URL}/auth`, {
            method: "GET"
        })
    } catch (error: any) {
        console.error(error)
        createAlert(error.response.data.message)
        return null
    }
}
