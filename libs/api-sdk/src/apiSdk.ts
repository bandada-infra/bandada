import { SupportedUrl, GroupResponse, InviteResponse } from "./types"
import checkParameter from "./checkParameter"
import {
    getGroups,
    getGroup,
    isGroupMember,
    generateMerkleProof,
    addMemberByApiKey,
    addMembersByApiKey,
    addMemberByInviteCode,
    removeMemberByApiKey,
    removeMembersByApiKey
} from "./groups"
import { getInvite } from "./invites"

export default class ApiSdk {
    private _url: string
    private _config: object

    /**
     * Initializes the ApiSdk object with a Supported URL or custom URL.
     * @param url Supported URL or custom URL.
     * @param config Request config.
     */
    constructor(url: SupportedUrl | string = SupportedUrl.PROD, config?: any) {
        checkParameter(url, "url", "string")

        if (config) {
            if (!config.baseURL) {
                this._config = {
                    baseURL: url,
                    ...config
                }
            } else {
                if (url !== config.baseURL)
                    throw new Error("The url and baseURL should be the same")
                this._config = config
            }
        } else {
            this._config = {
                headers: {
                    "Content-Type": "application/json"
                },
                baseURL: url
            }
        }

        this._url = url
    }

    /**
     * Returns the API URL.
     * @returns API URL.
     */
    get url(): string {
        return this._url
    }

    /**
     * Returns the API Config.
     * @returns API Config.
     */
    get config(): object {
        return this._config
    }

    /**
     * Returns the list of groups.
     * @returns List of groups.
     */
    async getGroups(): Promise<GroupResponse[]> {
        const groups = await getGroups(this._config)

        return groups
    }

    /**
     * Returns a specific group.
     * @param groupId Group id.
     * @returns Specific group.
     */
    async getGroup(groupId: string): Promise<GroupResponse> {
        const group = await getGroup(this._config, groupId)

        return group
    }

    /**
     * Returns true if the member is in the group and false otherwise.
     * @param groupId Group id.
     * @param memberId Member id.
     * @returns true or false.
     */
    async isGroupMember(groupId: string, memberId: string): Promise<boolean> {
        const isMember = await isGroupMember(this._config, groupId, memberId)

        return isMember
    }

    /**
     * Returns the Merkle Proof for a member in a group.
     * @param groupId Group id.
     * @param memberId Member id.
     * @returns the Merkle Proof.
     */
    async generateMerkleProof(
        groupId: string,
        memberId: string
    ): Promise<string> {
        const merkleProof = await generateMerkleProof(
            this._config,
            groupId,
            memberId
        )

        return merkleProof
    }

    /**
     * Adds a member to a group using an API Key.
     * @param groupId Group id.
     * @param memberId Member id.
     * @param apiKey API Key.
     * @returns undefined.
     */
    async addMemberByApiKey(
        groupId: string,
        memberId: string,
        apiKey: string
    ): Promise<void> {
        await addMemberByApiKey(this._config, groupId, memberId, apiKey)
    }

    /**
     * Adds several members to a group using an API Key.
     * @param groupId Group id.
     * @param memberIds Member ids.
     * @param apiKey API Key.
     * @returns undefined.
     */
    async addMembersByApiKey(
        groupId: string,
        memberIds: string[],
        apiKey: string
    ): Promise<void> {
        await addMembersByApiKey(this._config, groupId, memberIds, apiKey)
    }

    /**
     * Adds a member to a group using an Invite Code.
     * @param groupId Group id.
     * @param memberId Member id.
     * @param inviteCode Invite Code.
     * @returns undefined.
     */
    async addMemberByInviteCode(
        groupId: string,
        memberId: string,
        inviteCode: string
    ): Promise<void> {
        await addMemberByInviteCode(this._config, groupId, memberId, inviteCode)
    }

    /**
     * Removes a member from a group using an API Key.
     * @param groupId Group id.
     * @param memberId Member id.
     * @param apiKey API Key.
     * @returns undefined.
     */
    async removeMemberByApiKey(
        groupId: string,
        memberId: string,
        apiKey: string
    ): Promise<void> {
        await removeMemberByApiKey(this._config, groupId, memberId, apiKey)
    }

    /**
     * Removes multiple members from a group using an API Key.
     * @param groupId Group id.
     * @param memberIds Member ids.
     * @param apiKey API Key.
     * @returns undefined.
     */
    async removeMembersByApiKey(
        groupId: string,
        memberIds: string[],
        apiKey: string
    ): Promise<void> {
        await removeMembersByApiKey(this._config, groupId, memberIds, apiKey)
    }

    /**
     * Returns a specific invite.
     * @param inviteCode Invite code.
     * @returns Specific invite.
     */
    async getInvite(inviteCode: string): Promise<InviteResponse> {
        const invite = getInvite(this._config, inviteCode)

        return invite
    }
}
