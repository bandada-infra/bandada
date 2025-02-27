import { ApiSdk, DashboardUrl, Group, Invite } from "@bandada/api-sdk"

const api = new ApiSdk(import.meta.env.VITE_API_URL)

export { DashboardUrl }

export async function getInvite(inviteCode: string): Promise<Invite | null> {
    try {
        return await api.getInvite(inviteCode)
    } catch (error: any) {
        console.error(error)

        if (error.response) {
            alert(error.response.statusText)
        } else {
            alert("Some error occurred!")
        }

        return null
    }
}

export async function getGroup(groupId: string): Promise<Group | null> {
    try {
        return await api.getGroup(groupId)
    } catch (error: any) {
        console.error(error)

        if (error.response) {
            alert(error.response.statusText)
        } else {
            alert("Some error occurred!")
        }

        return null
    }
}

export async function isGroupMember(
    groupId: string,
    memberId: string
): Promise<boolean | null> {
    try {
        return await api.isGroupMember(groupId, memberId)
    } catch (error: any) {
        console.error(error)

        if (error.response) {
            alert(error.response.statusText)
        } else {
            alert("Some error occurred!")
        }

        return null
    }
}

export async function addMemberByInviteCode(
    groupId: string,
    memberId: string,
    inviteCode: string
): Promise<void | null> {
    try {
        return await api.addMemberByInviteCode(groupId, memberId, inviteCode)
    } catch (error: any) {
        console.error(error)

        if (error.response) {
            alert(error.response.statusText)
        } else {
            alert("Some error occurred!")
        }

        return null
    }
}

export function getCredentialGroupJoinUrl(
    dashboardUrl: DashboardUrl,
    groupId: string,
    commitment: string,
    providerName: string,
    redirectUri?: string
): string | null {
    try {
        return api.getCredentialGroupJoinUrl(
            dashboardUrl,
            groupId,
            commitment,
            providerName,
            redirectUri
        )
    } catch (error: any) {
        console.error(error)

        if (error.response) {
            alert(error.response.statusText)
        } else {
            alert("Some error occurred!")
        }

        return null
    }
}

export function getMultipleCredentialsGroupJoinUrl(
    dashboardUrl: DashboardUrl,
    groupId: string,
    commitment: string,
    redirectUri?: string
): string | null {
    try {
        return api.getMultipleCredentialsGroupJoinUrl(
            dashboardUrl,
            groupId,
            commitment,
            redirectUri
        )
    } catch (error: any) {
        console.error(error)

        if (error.response) {
            alert(error.response.statusText)
        } else {
            alert("Some error occurred!")
        }

        return null
    }
}
