import {
    SupportedUrl,
    Group,
    Invite,
    GroupCreationDetails,
    GroupUpdateDetails
} from "./types"
import checkParameter from "./checkParameter"
import {
    getGroups,
    getGroup,
    createGroups,
    removeGroup,
    removeGroups,
    updateGroup,
    updateGroups,
    isGroupMember,
    generateMerkleProof,
    addMemberByApiKey,
    addMembersByApiKey,
    addMemberByInviteCode,
    removeMemberByApiKey,
    removeMembersByApiKey
} from "./groups"
import { createInvite, getInvite } from "./invites"

export default class ApiSdk {
    private _url: string
    private _config: object

    /**
     * Initializes the ApiSdk object with a Supported URL or custom URL.
     * @param url Supported URL or custom URL.
     * @param config [Axios](https://axios-http.com/docs/req_config) Request Config.
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
    async getGroups(): Promise<Group[]> {
        const groups = await getGroups(this._config)

        return groups
    }

    /**
     * Creates a group using the API key.
     * @param groupCreationDetails Data to create the group.
     * @param apiKey The API key of the admin of the group.
     * @returns The created group.
     */
    async createGroup(
        groupCreationDetails: GroupCreationDetails,
        apiKey: string
    ): Promise<Group> {
        const groups = await createGroups(
            this._config,
            [groupCreationDetails],
            apiKey
        )

        return groups[0]
    }

    /**
     * Creates one or more groups using the API key.
     * @param groupsCreationDetails Data to create the groups.
     * @param apiKey The API key of the admin of the groups.
     * @returns The created groups.
     */
    async createGroups(
        groupsCreationDetails: Array<GroupCreationDetails>,
        apiKey: string
    ): Promise<Array<Group>> {
        const groups = await createGroups(
            this._config,
            groupsCreationDetails,
            apiKey
        )

        return groups
    }

    /**
     * Removes a group using the API key.
     * @param groupId The group id.
     * @param apiKey The API key of the admin of the group.
     * @returns undefined.
     */
    async removeGroup(groupId: string, apiKey: string): Promise<void> {
        await removeGroup(this._config, groupId, apiKey)
    }

    /**
     * Removes one or more group using the API key.
     * @param groupIds The group ids.
     * @param apiKey The API key of the admin of the groups.
     * @returns undefined.
     */
    async removeGroups(groupIds: Array<string>, apiKey: string): Promise<void> {
        await removeGroups(this._config, groupIds, apiKey)
    }

    /**
     * Update a specific group using the API key.
     * @param groupId The group id.
     * @param groupUpdateDetails Data to update the group.
     * @param apiKey The API key of the admin of the group.
     * @returns The updated group.
     */
    async updateGroup(
        groupId: string,
        groupUpdateDetails: GroupUpdateDetails,
        apiKey: string
    ): Promise<Group> {
        const group = await updateGroup(
            this._config,
            groupId,
            groupUpdateDetails,
            apiKey
        )

        return group
    }

    /**
     * Updats one or more groups using the API key.
     * @param groupIds The group ids.
     * @param groupsUpdateDetails Data to update the groups.
     * @param apiKey The API key of the admin of the groups.
     * @returns The updated groups.
     */
    async updateGroups(
        groupIds: Array<string>,
        groupsUpdateDetails: Array<GroupUpdateDetails>,
        apiKey: string
    ): Promise<Array<Group>> {
        const groups = await updateGroups(
            this._config,
            groupIds,
            groupsUpdateDetails,
            apiKey
        )

        return groups
    }

    /**
     * Returns a specific group.
     * @param groupId Group id.
     * @returns Specific group.
     */
    async getGroup(groupId: string): Promise<Group> {
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
     * @param apiKey API Key of the admin of the group.
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
     * @param apiKey API Key of the admin of the group.
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
     * @param apiKey API Key of the admin of the group.
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
     * @param apiKey API Key of the admin of the group.
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
     * Creates a new group invite.
     * @param groupId The group identifier.
     * @param apiKey The api key.
     * @returns Specific invite.
     */
    async createInvite(groupId: string, apiKey: string): Promise<Invite> {
        const invite = await createInvite(this._config, groupId, apiKey)

        return invite
    }

    /**
     * Returns a specific invite.
     * @param inviteCode Invite code.
     * @returns Specific invite.
     */
    async getInvite(inviteCode: string): Promise<Invite> {
        const invite = await getInvite(this._config, inviteCode)

        return invite
    }
}
