import { BandadaContract, getBandadaContract, Network } from "@bandada/utils"
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
import { v4 } from "uuid"
import { InvitesService } from "../invites/invites.service"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "./entities/group.entity"
import { Member } from "./entities/member.entity"
import { MerkleProof } from "./types"

@Injectable()
export class GroupsService {
    private cachedGroups: Map<string, CachedGroup>
    private bandadaContract: BandadaContract

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        @Inject(forwardRef(() => InvitesService))
        private readonly invitesService: InvitesService
    ) {
        this.cachedGroups = new Map()
        this.bandadaContract = getBandadaContract(
            process.env.ETHEREUM_NETWORK as Network,
            process.env.BACKEND_PRIVATE_KEY as string,
            process.env.INFURA_API_KEY as string
        )

        this._cacheGroups()

        if (process.env.NODE_ENV !== "test") {
            setTimeout(() => {
                this._syncContractGroups()
            }, 5000)
        }
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
            reputationCriteria
        }: CreateGroupDto,
        adminId: string
    ): Promise<Group> {
        const _groupId =
            groupId ||
            BigInt(id(name + adminId))
                .toString()
                .slice(0, 32)

        const group = this.groupRepository.create({
            id: _groupId,
            name,
            description,
            treeDepth,
            fingerprintDuration,
            reputationCriteria,
            adminId,
            members: []
        })

        await this.groupRepository.save(group)

        const cachedGroup = new CachedGroup(group.id, group.treeDepth)

        this.cachedGroups.set(_groupId, cachedGroup)

        this._updateFingerprintDuration(group.id, fingerprintDuration)

        Logger.log(
            `GroupsService: group '${name}' has been created with id '${_groupId}'`
        )

        return group
    }

    /**
     * Removes a group.
     * @param groupId Group id.
     * @param adminId Admin id.
     */
    async removeGroup(groupId: string, adminId: string): Promise<void> {
        const group = await this.getGroup(groupId)

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
            apiEnabled,
            reputationCriteria,
            fingerprintDuration
        }: UpdateGroupDto,
        adminId: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

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
            this._updateContractGroup(cachedGroup)
        }

        if (group.reputationCriteria && reputationCriteria) {
            group.reputationCriteria = reputationCriteria
        }

        if (!group.reputationCriteria && apiEnabled !== undefined) {
            group.apiEnabled = apiEnabled

            // Generate a new API key if it doesn't exist
            if (!group.apiKey) {
                group.apiKey = v4()
            }
        }

        await this.groupRepository.save(group)

        Logger.log(`GroupsService: group '${group.name}' has been updated`)

        return group
    }

    /**
     * Updates the group api key.
     * @param groupId Group id.
     * @param adminId Group admin id.
     */
    async updateApiKey(groupId: string, adminId: string): Promise<string> {
        const group = await this.getGroup(groupId)

        if (group.adminId !== adminId) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        if (!group.apiEnabled) {
            throw new UnauthorizedException(
                `Group '${groupId}' API key is not enabled`
            )
        }

        group.apiKey = v4()

        await this.groupRepository.save(group)

        Logger.log(
            `GroupsService: group '${group.name}' APIs have been updated`
        )

        return group.apiKey
    }

    /**
     * Join the group by redeeming invite code.
     * @param groupId Group name.
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
     * Add a member to the group manually as an admin
     * @param groupId ID of the group
     * @param memberId ID of the member to be added
     * @param adminId id of the admin making the request
     * @returns Group
     */
    async addMemberManually(
        groupId: string,
        memberId: string,
        adminId: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        if (group.adminId !== adminId) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        if (this.isGroupMember(groupId, memberId)) {
            throw new BadRequestException(
                `Member '${memberId}' already exists in the group '${groupId}'`
            )
        }

        return this.addMember(groupId, memberId)
    }

    /**
     * Add a member to the group using API Key.
     * @param groupId ID of the group
     * @param memberId ID of the member to be added
     * @param apiKey API key for the group
     * @returns Group
     */
    async addMemberWithAPIKey(
        groupId: string,
        memberId: string,
        apiKey: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        if (!group.apiEnabled || group.apiKey !== apiKey) {
            throw new BadRequestException(
                `Invalid API key or API access not enabled for group '${groupId}'`
            )
        }

        if (this.isGroupMember(groupId, memberId)) {
            throw new BadRequestException(
                `Member '${memberId}' already exists in the group '${groupId}'`
            )
        }

        return this.addMember(groupId, memberId)
    }

    /**
     * Add a member to the group.
     * @param groupId ID of the group
     * @param memberId ID of the member to be added
     * @returns Group
     */
    async addMember(groupId: string, memberId: string): Promise<Group> {
        const group = await this.getGroup(groupId)

        const member = new Member()
        member.group = group
        member.id = memberId

        group.members.push(member)

        await this.groupRepository.save(group)

        const cachedGroup = this.cachedGroups.get(groupId)

        cachedGroup.addMember(memberId)

        Logger.log(
            `GroupsService: member '${memberId}' has been added to the group '${group.name}'`
        )

        this._updateContractGroup(cachedGroup)

        return group
    }

    /**
     * Delete a member from group
     * @param groupId Group name.
     * @param memberId Member's identity commitment.
     * @param adminId Group admin id.
     * @returns Group data with removed member.
     */
    async removeMember(
        groupId: string,
        memberId: string,
        adminId: string
    ): Promise<Group> {
        if (!this.isGroupMember(groupId, memberId)) {
            throw new BadRequestException(
                `Member '${memberId}' is not a member of group '${groupId}'`
            )
        }

        const group = await this.getGroup(groupId)

        if (group.adminId !== adminId) {
            throw new BadRequestException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        const member = group.members.find((m) => m.id === memberId)

        await this.memberRepository.remove(member)

        const cachedGroup = this.cachedGroups.get(groupId)

        cachedGroup.removeMember(cachedGroup.indexOf(BigInt(memberId)))

        Logger.log(
            `GroupsService: member '${memberId}' has been removed from the group '${group.name}'`
        )

        this._updateContractGroup(cachedGroup)

        return this.getGroup(groupId)
    }

    /**
     * Delete a member from group using API Key
     * @param groupId Group name.
     * @param memberId Member's identity commitment.
     * @returns Group data with removed member.
     */
    async removeMemberWithAPIKey(
        groupId: string,
        memberId: string,
        apiKey: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        if (!group.apiEnabled || group.apiKey !== apiKey) {
            throw new BadRequestException(
                `Invalid API key or API access not enabled for group '${groupId}'`
            )
        }

        if (!this.isGroupMember(groupId, memberId)) {
            throw new BadRequestException(
                `Member '${memberId}' is not a member of group '${groupId}'`
            )
        }

        const member = group.members.find((m) => m.id === memberId)

        await this.memberRepository.remove(member)

        const cachedGroup = this.cachedGroups.get(groupId)

        cachedGroup.removeMember(cachedGroup.indexOf(BigInt(memberId)))

        Logger.log(
            `GroupsService: member '${memberId}' has been removed from the group '${group.name}'`
        )

        this._updateContractGroup(cachedGroup)

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
            where
        })
    }

    /**
     * Returns a specific group.
     * @param groupId Group name.
     * @returns Specific group.
     */
    async getGroup(groupId: string): Promise<Group> {
        const group = await this.groupRepository.findOne({
            relations: { members: true, reputationAccounts: true },
            where: { id: groupId }
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

    private async _updateFingerprintDuration(
        groupId: string,
        duration: number
    ): Promise<void> {
        try {
            await this.bandadaContract.updateFingerprintDuration(
                BigInt(groupId),
                BigInt(duration)
            )
            Logger.log(
                `GroupsService: group '${groupId}' fingerprint duration has been updated in the contract`
            )
        } catch {
            Logger.log(
                `GroupsService: failed to update fingerprint duration contract groups`
            )
        }
    }

    private async _cacheGroups() {
        const groups = await this.getGroups()

        /* istanbul ignore next */
        for (const group of groups) {
            const cachedGroup = new CachedGroup(
                group.id,
                group.treeDepth,
                group.members.map((m) => m.id)
            )

            this.cachedGroups.set(group.id, cachedGroup)
        }

        Logger.log(`GroupsService: ${groups.length} groups have been cached`)
    }

    /**
     * If the off-chain groups roots don't match the contract's ones, it updates them.
     */
    /* istanbul ignore next */
    private async _syncContractGroups() {
        const contractGroups = await this.bandadaContract.getGroups()
        const fingerprints = new Set(
            contractGroups.map(({ fingerprint }) => fingerprint.toString())
        )

        for (const [, group] of this.cachedGroups) {
            if (!fingerprints.has(group.root.toString())) {
                this._updateContractGroup(group)
            }
        }
    }

    /**
     * Update the fingerprint of the group in the contract.
     * @param group Off-chain group.
     */
    /* istanbul ignore next */
    private async _updateContractGroup(group: CachedGroup): Promise<void> {
        const tx = await this.bandadaContract.updateGroups([
            {
                id: BigInt(group.id),
                fingerprint: BigInt(group.root)
            }
        ])

        if (tx.status && tx.logs.length === 1) {
            Logger.log(
                `GroupsService: group '${group.id}' has been updated in the contract`
            )
        } else {
            Logger.error(`GroupsService: failed to update contract groups`)
        }
    }
}
