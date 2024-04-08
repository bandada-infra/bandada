// import { BandadaContract, getBandadaContract, Network } from "@bandada/utils"
import { id } from "@ethersproject/hash"
import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Group as CachedGroup } from "@semaphore-protocol/group"
import { Repository } from "typeorm"
import { InvitesService } from "../invites/invites.service"
import { AdminsService } from "../admins/admins.service"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "./entities/group.entity"
import { Member } from "./entities/member.entity"
import { MerkleProof } from "./types"
import { getAndCheckAdmin } from "../utils"

@Injectable()
export class GroupsService {
    private cachedGroups: Map<string, CachedGroup>
    // private bandadaContract: BandadaContract

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        @Inject(forwardRef(() => InvitesService))
        private readonly invitesService: InvitesService,
        private readonly adminsService: AdminsService
    ) {
        this.cachedGroups = new Map()
        // this.bandadaContract = getBandadaContract(
        //     process.env.ETHEREUM_NETWORK as Network,
        //     process.env.BACKEND_PRIVATE_KEY as string,
        //     process.env.INFURA_API_KEY as string
        // )
    }

    /**
     * Initialises the service, caches groups and may sync contract
     * groups if required.
     */
    async initialize() {
        await this._cacheGroups()

        /* istanbul ignore next */
        // if (process.env.NODE_ENV !== "test") {
        //     setTimeout(async () => {
        //         await this._syncContractGroups()
        //     }, 5000)
        // }
    }

    /**
     * Create a group using API Key.
     * @param dto External parameters used to create a new group.
     * @param apiKey The API Key.
     * @returns Created group.
     */
    async createGroupWithAPIKey(
        dto: CreateGroupDto,
        apiKey: string
    ): Promise<Group> {
        const groups = await this.createGroupsWithAPIKey([dto], apiKey)

        return groups.at(0)
    }

    /**
     * Create groups using API Key.
     * @param dtos External parameters used to create new groups.
     * @param apiKey The API Key.
     * @returns Created groups.
     */
    async createGroupsWithAPIKey(
        dtos: Array<CreateGroupDto>,
        apiKey: string
    ): Promise<Array<Group>> {
        const newGroups: Array<Group> = []

        const admin = await getAndCheckAdmin(this.adminsService, apiKey)

        for await (const dto of dtos) {
            const group = await this.createGroup(dto, admin.id)

            newGroups.push(group)
        }

        return newGroups
    }

    /**
     * Create group manually without using API Key.
     * @param dto External parameters used to create a new group.
     * @param adminId Admin id.
     * @returns Created group.
     */
    async createGroupManually(
        dto: CreateGroupDto,
        adminId: string
    ): Promise<Group> {
        const admin = await this.adminsService.findOne({ id: adminId })

        if (!admin) throw new BadRequestException(`You are not an admin`)

        return this.createGroup(dto, adminId)
    }

    /**
     * Create groups manually without using API Key.
     * @param dtos External parameters used to create new groups.
     * @param adminId Admin id.
     * @returns Created groups.
     */
    async createGroupsManually(
        dtos: Array<CreateGroupDto>,
        adminId: string
    ): Promise<Array<Group>> {
        const admin = await this.adminsService.findOne({ id: adminId })

        if (!admin) throw new BadRequestException(`You are not an admin`)

        const newGroups: Array<Group> = []

        for await (const dto of dtos) {
            const group = await this.createGroup(dto, adminId)

            newGroups.push(group)
        }

        return newGroups
    }

    /**
     * Creates a new group.
     * @param dto External parameters used to create a new group.
     * @param adminId Admin id.
     * @returns Created group.
     */
    async createGroup(
        {
            id: groupId,
            name,
            description,
            treeDepth,
            fingerprintDuration,
            credentials
        }: CreateGroupDto,
        adminId: string
    ): Promise<Group> {
        const _groupId =
            groupId ||
            BigInt(id(name + adminId))
                .toString()
                .slice(0, 32)

        if (credentials === undefined) credentials = null

        const group = this.groupRepository.create({
            id: _groupId,
            name,
            description,
            treeDepth,
            fingerprintDuration,
            credentials,
            adminId,
            members: []
        })

        await this.groupRepository.save(group)

        const cachedGroup = new CachedGroup(group.id, group.treeDepth)

        this.cachedGroups.set(_groupId, cachedGroup)

        // this._updateFingerprintDuration(group.id, fingerprintDuration)

        Logger.log(
            `GroupsService: group '${name}' has been created with id '${_groupId}'`
        )

        return group
    }

    /**
     * Remove a group using API Key.
     * @param groupId Group id.
     * @param adminId Admin id.
     * @param apiKey the api key.
     * @returns Created group.
     */
    async removeGroupWithAPIKey(
        groupId: string,
        apiKey: string
    ): Promise<void> {
        return this.removeGroupsWithAPIKey([groupId], apiKey)
    }

    /**
     * Remove groups using API Key.
     * @param groupIds Groups identifiers.
     * @param apiKey the api key.
     */
    async removeGroupsWithAPIKey(
        groupIds: Array<string>,
        apiKey: string
    ): Promise<void> {
        const admin = await getAndCheckAdmin(this.adminsService, apiKey)

        for await (const groupId of groupIds) {
            await this.removeGroup(groupId, admin.id)
        }
    }

    /**
     * Remove a group manually without using API Key.
     * @param groupId Group id.
     * @param adminId Admin id.
     */
    async removeGroupManually(groupId: string, adminId: string): Promise<void> {
        return this.removeGroup(groupId, adminId)
    }

    /**
     * Remove groups manually without using API Key.
     * @param groupIds Groups identifiers.
     * @param adminId Admin id.
     */
    async removeGroupsManually(
        groupIds: Array<string>,
        adminId: string
    ): Promise<void> {
        for await (const groupId of groupIds) {
            await this.removeGroup(groupId, adminId)
        }
    }

    /**
     * Removes a group.
     * @param groupId Group id.
     * @param adminId Admin id.
     */
    async removeGroup(groupId: string, adminId: string): Promise<void> {
        const group = await this.getGroup(groupId)

        if (!group)
            throw new BadRequestException(
                `The group '${groupId}' does not exists`
            )

        if (group.adminId !== adminId) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        await this.groupRepository.remove(group)

        this.cachedGroups.delete(groupId)

        Logger.log(`GroupsService: group '${group.name}' has been removed`)
    }

    /**
     * Update a group using API Key.
     * @param groupId Group id.
     * @param dto External parameters used to update a group.
     * @param apiKey the API Key.
     * @returns Updated group.
     */
    async updateGroupWithApiKey(
        groupId: string,
        dto: UpdateGroupDto,
        apiKey: string
    ): Promise<Group> {
        const admin = await getAndCheckAdmin(this.adminsService, apiKey)

        return this.updateGroup(groupId, dto, admin.id)
    }

    /**
     * Update groups using API Key.
     * @param groupIds Group ids.
     * @param dtos External parameters used to update groups.
     * @param apiKey the API Key.
     * @returns Updated group.
     */
    async updateGroupsWithApiKey(
        groupIds: Array<string>,
        dtos: Array<UpdateGroupDto>,
        apiKey: string
    ): Promise<Array<Group>> {
        const updatedGroups: Array<Group> = []

        const admin = await getAndCheckAdmin(this.adminsService, apiKey)

        for await (const [index, groupId] of groupIds.entries()) {
            const dto = dtos[index]
            const group = await this.updateGroup(groupId, dto, admin.id)
            updatedGroups.push(group)
        }

        return updatedGroups
    }

    /**
     * Update a group manually without using API Key.
     * @param groupId Group id.
     * @param dto External parameters used to update a group.
     * @param adminId Group admin id.
     * @returns Updated group.
     */
    async updateGroupManually(
        groupId: string,
        dto: UpdateGroupDto,
        adminId: string
    ): Promise<Group> {
        return this.updateGroup(groupId, dto, adminId)
    }

    /**
     * Update groups manually without using API Key.
     * @param groupIds Group ids.
     * @param dtos External parameters used to update groups.
     * @param adminId Group admin id.
     * @returns Updated groups.
     */
    async updateGroupsManually(
        groupIds: Array<string>,
        dtos: Array<UpdateGroupDto>,
        adminId: string
    ): Promise<Array<Group>> {
        const updatedGroups: Array<Group> = []

        for await (const [index, groupId] of groupIds.entries()) {
            const dto = dtos[index]
            const group = await this.updateGroup(groupId, dto, adminId)
            updatedGroups.push(group)
        }

        return updatedGroups
    }

    /**
     * Updates some parameters of the group.
     * @param groupId Group id.
     * @param dto External parameters used to update a group.
     * @param adminId Group admin id.
     * @returns Updated group.
     */
    async updateGroup(
        groupId: string,
        {
            description,
            treeDepth,
            credentials,
            fingerprintDuration
        }: UpdateGroupDto,
        adminId: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        if (!group)
            throw new BadRequestException(
                `The group '${groupId}' does not exists`
            )

        if (group.adminId !== adminId) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        if (description) {
            group.description = description
        }

        if (fingerprintDuration) {
            group.fingerprintDuration = fingerprintDuration
        }

        if (treeDepth) {
            group.treeDepth = treeDepth

            const cachedGroup = new CachedGroup(
                groupId,
                treeDepth,
                group.members.map((m) => m.id)
            )
            this.cachedGroups.set(groupId, cachedGroup)
            // this._updateContractGroup(cachedGroup)
        }

        if (group.credentials && credentials) {
            group.credentials = credentials
        }

        await this.groupRepository.save(group)

        Logger.log(`GroupsService: group '${group.name}' has been updated`)

        return group
    }

    /**
     * Join the group by redeeming invite code.
     * @param groupId Group id.
     * @param memberId Member's identity commitment.
     * @param dto Parameters used to add a group member.
     * @returns Group data with added member.
     */
    async joinGroup(
        groupId: string,
        memberId: string,
        dto: { inviteCode: string }
    ): Promise<Group> {
        if (this.isGroupMember(groupId, memberId)) {
            throw new BadRequestException(
                `Member '${memberId}' already exists in the group '${groupId}'`
            )
        }

        await this.invitesService.redeemInvite(dto.inviteCode, groupId)

        return this.addMember(groupId, memberId)
    }

    /**
     * Add a member to the group manually as an admin.
     * @param groupId Group id.
     * @param memberIds Member's identity to be added
     * @param adminId id of the admin making the request
     * @returns Group
     */
    async addMemberManually(
        groupId: string,
        memberId: string,
        adminId: string
    ): Promise<Group> {
        return this.addMembersManually(groupId, [memberId], adminId)
    }

    /**
     * Add members to the group manually as an admin.
     * @param groupId Group id.
     * @param memberIds Array of member IDs to be added
     * @param adminId id of the admin making the request
     * @returns Group
     */
    async addMembersManually(
        groupId: string,
        memberIds: string[],
        adminId: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        // Check if the group is a credential group
        if (group.credentials !== null) {
            throw new Error(
                `The group '${group.name}' is a credential group. You cannot manually add members to a credential group.`
            )
        }

        if (group.adminId !== adminId) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        for (const memberId of memberIds) {
            if (this.isGroupMember(groupId, memberId)) {
                throw new BadRequestException(
                    `Member '${memberId}' already exists in the group '${groupId}'`
                )
            }
        }

        return this.addMembers(groupId, memberIds)
    }

    /**
     * Add a member to the group using API Key.
     * @param groupId Group id.
     * @param memberIds  Member's identity to be added
     * @param apiKey API key for the group
     * @returns Group
     */
    async addMemberWithAPIKey(
        groupId: string,
        memberId: string,
        apiKey: string
    ): Promise<Group> {
        return this.addMembersWithAPIKey(groupId, [memberId], apiKey)
    }

    /**
     * Add members to the group using API Key.
     * @param groupId Group id.
     * @param memberIds Array of member IDs to be added
     * @param apiKey API key for the group
     * @returns Group
     */
    async addMembersWithAPIKey(
        groupId: string,
        memberIds: string[],
        apiKey: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        // Check if the group is a credential group
        if (group.credentials !== null) {
            throw new Error(
                `The group '${group.name}' is a credential group. You cannot add members to a credential group using an API Key.`
            )
        }

        const admin = await this.adminsService.findOne({ id: group.adminId })

        if (!admin) {
            throw new BadRequestException(
                `Invalid admin for group '${groupId}'`
            )
        }

        if (!admin.apiEnabled || admin.apiKey !== apiKey) {
            throw new BadRequestException(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        }

        for (const memberId of memberIds) {
            if (this.isGroupMember(groupId, memberId)) {
                throw new BadRequestException(
                    `Member '${memberId}' already exists in the group '${groupId}'`
                )
            }
        }

        return this.addMembers(groupId, memberIds)
    }

    /**
     * Add a member to the group.
     * @param groupId Group id.
     * @param memberId ID of the member to be added
     * @returns Group
     */
    async addMember(groupId: string, memberId: string): Promise<Group> {
        const group = await this.getGroup(groupId)

        // Check if the member is already a group member.
        const isMemberInGroup = group.members.some((m) => m.id === memberId)

        if (isMemberInGroup) {
            throw new Error(
                `Member '${memberId}' is already in the group '${group.name}'`
            )
        }

        // Check if the member is already a member of another group.
        let member = await this.memberRepository.findOne({
            where: { id: memberId }
        })

        if (!member) {
            member = new Member()
            member.id = memberId

            await this.memberRepository.save(member)
        }

        group.members.push(member)

        await this.groupRepository.save(group)

        const cachedGroup = this.cachedGroups.get(groupId)

        cachedGroup.addMember(memberId)

        Logger.log(
            `GroupsService: member '${memberId}' has been added to the group '${group.name}'`
        )

        // this._updateContractGroup(cachedGroup)

        return group
    }

    /**
     * Add multiple members to the group.
     * @param groupId Group id.
     * @param memberIds Array of member IDs to be added
     * @returns Group
     */
    async addMembers(groupId: string, memberIds: string[]): Promise<Group> {
        const group = await this.getGroup(groupId)

        for (const memberId of memberIds) {
            const member = group.members.find((m) => m.id === memberId)

            if (!member) {
                let newMember: Member

                // Check if the member is already a member of another group.
                // eslint-disable-next-line
                const anotherGroupMember = await this.memberRepository.findOne({
                    where: { id: memberId }
                })

                if (!anotherGroupMember) {
                    newMember = new Member()
                    newMember.id = memberId

                    // eslint-disable-next-line
                    await this.memberRepository.save(newMember)
                } else {
                    newMember = anotherGroupMember
                }

                group.members.push(newMember)
            }
        }

        await this.groupRepository.save(group)

        const cachedGroup = this.cachedGroups.get(groupId)

        memberIds.forEach((memberId) => {
            cachedGroup.addMember(memberId)
            Logger.log(
                `GroupsService: member '${memberId}' has been added to the group '${group.name}'`
            )
        })

        // this._updateContractGroup(cachedGroup)

        return group
    }

    /**
     * Delete a member from a group.
     * @param groupId Group id.
     * @param memberId Member's identity commitment.
     * @param adminId Group admin id.
     * @returns Group data with removed member.
     */
    async removeMemberManually(
        groupId: string,
        memberId: string,
        adminId: string
    ): Promise<Group> {
        return this.removeMembersManually(groupId, [memberId], adminId)
    }

    /**
     * Delete members from a group.
     * @param groupId Group id.
     * @param memberIds Array of member's identity commitments.
     * @param adminId Group admin id.
     * @returns Group data with removed member.
     */
    async removeMembersManually(
        groupId: string,
        memberIds: string[],
        adminId: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        if (group.adminId !== adminId) {
            throw new BadRequestException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        const membersToRemove = []

        for (const memberId of memberIds) {
            if (!this.isGroupMember(groupId, memberId)) {
                throw new BadRequestException(
                    `Member '${memberId}' is not a member of group '${groupId}'`
                )
            }
            const member: Member = group.members.find(
                (m: Member) => m.id === memberId
            )

            if (member) membersToRemove.push(member)
        }

        const cachedGroup = this.cachedGroups.get(groupId)

        await Promise.all(
            memberIds.map(async (memberId) => {
                // Check if the member is a group member.
                const memberIndex = group.members.findIndex(
                    (m) => m.id === memberId
                )

                if (memberIndex !== -1) {
                    // Remove the member from the group.
                    group.members.splice(memberIndex, 1)

                    await this.groupRepository.save(group)
                }

                cachedGroup.removeMember(cachedGroup.indexOf(BigInt(memberId)))
                Logger.log(
                    `GroupsService: member '${memberId}' has been removed from the group '${group.name}'`
                )
            })
        )

        // this._updateContractGroup(cachedGroup)

        return this.getGroup(groupId)
    }

    /**
     * Delete a member from group using API Key
     * @param groupId Group id.
     * @param memberId Member's identity commitment.
     * @returns Group data with removed member.
     */
    async removeMemberWithAPIKey(
        groupId: string,
        memberId: string,
        apiKey: string
    ): Promise<Group> {
        return this.removeMembersWithAPIKey(groupId, [memberId], apiKey)
    }

    /**
     * Delete a member from group using API Key
     * @param groupId Group id.
     * @param memberIds Array of members' identity commitment.
     * @returns Group data with removed member.
     */
    async removeMembersWithAPIKey(
        groupId: string,
        memberIds: string[],
        apiKey: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)
        const admin = await this.adminsService.findOne({ id: group.adminId })

        if (!admin) {
            throw new BadRequestException(
                `Invalid admin for group '${groupId}'`
            )
        }

        if (!admin.apiEnabled || admin.apiKey !== apiKey) {
            throw new BadRequestException(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        }

        const membersToRemove = []

        for (const memberId of memberIds) {
            if (!this.isGroupMember(groupId, memberId)) {
                throw new BadRequestException(
                    `Member '${memberId}' is not a member of group '${groupId}'`
                )
            }

            // Check if the member is a group member.
            const member: Member = group.members.find(
                (m: Member) => m.id === memberId
            )

            if (member) membersToRemove.push(member)
        }

        const cachedGroup = this.cachedGroups.get(groupId)

        await Promise.all(
            memberIds.map(async (memberId) => {
                // Check if the member is a group member.
                const memberIndex = group.members.findIndex(
                    (m) => m.id === memberId
                )

                if (memberIndex !== -1) {
                    // Remove the member from the group.
                    group.members.splice(memberIndex, 1)

                    await this.groupRepository.save(group)
                }

                cachedGroup.removeMember(cachedGroup.indexOf(BigInt(memberId)))
                Logger.log(
                    `GroupsService: member '${memberId}' has been removed from the group '${group.name}'`
                )
            })
        )

        // this._updateContractGroup(cachedGroup)

        return this.getGroup(groupId)
    }

    /**
     * Returns a list of groups.
     * @returns List of existing groups.
     */
    async getGroups(filters?: { adminId: string }): Promise<Group[]> {
        const where = []

        if (filters?.adminId) {
            where.push({ adminId: filters.adminId })
        }

        return this.groupRepository.find({
            relations: { members: true },
            where,
            order: {
                members: {
                    createdAt: "ASC"
                }
            }
        })
    }

    /**
     * Returns a specific group.
     * @param groupId Group id.
     * @returns Specific group.
     */
    async getGroup(groupId: string): Promise<Group> {
        const group = await this.groupRepository.findOne({
            relations: { members: true, oAuthAccounts: true },
            where: { id: groupId },
            order: {
                members: {
                    createdAt: "ASC"
                }
            }
        })

        if (!group) {
            throw new NotFoundException(
                `Group with id '${groupId}' does not exist`
            )
        }

        return group
    }

    /**
     * Checks if a member belongs to a group.
     * @param groupId Group id.
     * @param member Member's identity commitment.
     * @returns True or false.
     */
    isGroupMember(groupId: string, member: string): boolean {
        const cachedGroup = this.cachedGroups.get(groupId)

        return cachedGroup.indexOf(BigInt(member)) !== -1
    }

    /**
     * Generates a proof of membership.
     * @param groupId Group id.
     * @param member Member's identity commitment.
     * @returns Merkle proof.
     */
    generateMerkleProof(groupId: string, member: string): MerkleProof {
        if (!this.isGroupMember(groupId, member)) {
            throw new BadRequestException(
                `Member '${member}' does not exist in the group '${groupId}'`
            )
        }

        const cachedGroup = this.cachedGroups.get(groupId)
        const memberIndex = cachedGroup.indexOf(BigInt(member))

        return cachedGroup.generateMerkleProof(memberIndex)
    }

    /**
     * Returns a group fingerprint.
     * @param groupId Group id.
     * @returns Group fingerprint.
     */
    async getFingerprint(groupId: string): Promise<string> {
        return (await this.getFingerprints([groupId]))[0]
    }

    /**
     * Returns a list of fingerprints from a list of groups.
     * @param groupIds Array of group ids.
     * @returns Fingerprints from groups.
     */
    async getFingerprints(groupIds: string[]): Promise<string[]> {
        const fingerprints: string[] = []

        for (const groupId of groupIds) {
            const cachedGroup = this.cachedGroups.get(groupId)
            if (cachedGroup) {
                fingerprints.push(cachedGroup.root.toString())
            }
        }

        return fingerprints
    }

    // private async _updateFingerprintDuration(
    //     groupId: string,
    //     duration: number
    // ): Promise<void> {
    //     try {
    //         await this.bandadaContract.updateFingerprintDuration(
    //             BigInt(groupId),
    //             BigInt(duration)
    //         )
    //         Logger.log(
    //             `GroupsService: group '${groupId}' fingerprint duration has been updated in the contract`
    //         )
    //     } catch {
    //         Logger.log(
    //             `GroupsService: failed to update fingerprint duration contract groups`
    //         )
    //     }
    // }

    private async _cacheGroups() {
        const groups = await this.getGroups()

        /* istanbul ignore next */
        for (const group of groups) {
            const members = []

            for (const member of group.members) {
                members.push(BigInt(member.id))
            }

            const cachedGroup = new CachedGroup(
                group.id,
                group.treeDepth,
                members
            )

            this.cachedGroups.set(group.id, cachedGroup)
        }

        Logger.log(`GroupsService: ${groups.length} groups have been cached`)
    }

    // /**
    //  * If the off-chain groups roots don't match the contract's ones, it updates them.
    //  */
    // /* istanbul ignore next */
    // private async _syncContractGroups() {
    //     const contractGroups = await this.bandadaContract.getGroups()
    //     const fingerprints = new Set(
    //         contractGroups.map(({ fingerprint }) => fingerprint.toString())
    //     )

    //     for (const [, group] of this.cachedGroups) {
    //         if (!fingerprints.has(group.root.toString())) {
    //             this._updateContractGroup(group)
    //         }
    //     }
    // }

    // /**
    //  * Update the fingerprint of the group in the contract.
    //  * @param group Off-chain group.
    //  */
    // /* istanbul ignore next */
    // private async _updateContractGroup(group: CachedGroup): Promise<void> {
    //     try {
    //         await this.bandadaContract.updateGroups([
    //             {
    //                 id: BigInt(group.id),
    //                 fingerprint: BigInt(group.root)
    //             }
    //         ])

    //         Logger.log(
    //             `GroupsService: group '${group.id}' has been updated in the contract`
    //         )
    //     } catch {
    //         Logger.error(`GroupsService: failed to update contract groups`)
    //     }
    // }
}
