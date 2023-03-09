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
import { SchedulerRegistry } from "@nestjs/schedule"
import { InjectRepository } from "@nestjs/typeorm"
import { Group as CachedGroup } from "@semaphore-protocol/group"
import {
    getZKGroupsContract,
    Network,
    OnchainZKGroup,
    ZKGroupsContract
} from "@zk-groups/utils"
import { Repository } from "typeorm"
import { InvitesService } from "../invites/invites.service"
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "./entities/group.entity"
import { Member } from "./entities/member.entity"
import { MerkleProof } from "./types"

@Injectable()
export class GroupsService {
    private cachedGroups: Map<string, CachedGroup>
    private updatedGroups: OnchainZKGroup[]
    private zkGroupsContract: ZKGroupsContract

    updateContractInterval: number = 60

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @Inject(forwardRef(() => InvitesService))
        private readonly invitesService: InvitesService,
        private schedulerRegistry: SchedulerRegistry
    ) {
        ;(async () => {
            this.cachedGroups = new Map()
            this.updatedGroups = []
            this.zkGroupsContract = getZKGroupsContract(
                process.env.DEFAULT_NETWORK as Network,
                process.env.BACKEND_PRIVATE_KEY as string
            )

            const groups = await this.getAllGroups()

            /* istanbul ignore next */
            for (const group of groups) {
                const cachedGroup = new CachedGroup(group.id, group.treeDepth)

                cachedGroup.addMembers(group.members.map((m) => m.id))

                this.cachedGroups.set(group.id, cachedGroup)

                this.updatedGroups.push({
                    id: BigInt(group.id),
                    fingerprint: BigInt(cachedGroup.root)
                })
            }

            this.updateContractGroups()

            Logger.log(
                `GroupsService: ${groups.length} groups have been cached`
            )
        })()
    }

    /**
     * Creates a new group.
     * @param dto External parameters used to create a new group.
     * @param admin Admin username.
     * @returns Created group.
     */
    async createGroup(
        { id: groupId, name, description, treeDepth, tag }: CreateGroupDto,
        admin: string
    ): Promise<Group> {
        const _groupId =
            groupId ||
            BigInt(id(name + admin))
                .toString()
                .slice(0, 32)

        const group = this.groupRepository.create({
            id: _groupId,
            name,
            description,
            treeDepth,
            tag,
            admin,
            members: []
        })

        await this.groupRepository.save(group)

        const cachedGroup = new CachedGroup(treeDepth)

        this.cachedGroups.set(_groupId, cachedGroup)

        Logger.log(
            `GroupsService: group '${name}' has been created with id '${_groupId}'`
        )

        return group
    }

    /**
     * Updates some parameters of the group.
     * @param dto External parameters used to update a group.
     * @param groupId Group id.
     * @param admin Admin username.
     * @returns Updated group.
     */
    async updateGroup(
        { description, treeDepth, tag }: UpdateGroupDto,
        groupId: string,
        admin: string
    ): Promise<Group> {
        const group = await this.getGroup(groupId)

        if (group.admin !== admin) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        group.description = description
        group.treeDepth = treeDepth
        group.tag = tag

        await this.groupRepository.save(group)

        Logger.log(`GroupsService: group '${group.name}' has been updated`)

        return group
    }

    /**
     * If a member does not exist in the group, they is added.
     * @param dto Parameters used to add a group member.
     * @param groupId Group name.
     * @param memberId Member's identity commitment.
     * @returns Group data with added member.
     */
    async addMember(
        { inviteCode }: AddMemberDto,
        groupId: string,
        memberId: string
    ): Promise<Group> {
        if (this.isGroupMember(groupId, memberId)) {
            throw new BadRequestException(
                `Member '${memberId}' already exists in the group '${groupId}'`
            )
        }

        await this.invitesService.redeemInvite(inviteCode, groupId)

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

        this.updatedGroups.push({
            id: BigInt(group.id),
            fingerprint: BigInt(cachedGroup.root)
        })

        this.updateContractGroups()

        return group
    }

    /**
     * Returns a list of groups.
     * @returns List of existing groups.
     */
    async getAllGroups(): Promise<Group[]> {
        return this.groupRepository.find({
            relations: { members: true }
        })
    }

    /**
     * Returns a list of groups of a specific admin.
     * @param admin Admin username.
     * @returns List of admin's existing groups.
     */
    async getGroupsByAdmin(admin: string): Promise<Group[]> {
        return this.groupRepository.find({
            relations: { members: true },
            where: { admin }
        })
    }

    /**
     * Returns a specific group.
     * @param groupId Group name.
     * @returns Specific group.
     */
    async getGroup(groupId: string): Promise<Group> {
        const group = await this.groupRepository.findOne({
            relations: { members: true },
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

    /**
     * Updates the contract groups after a certain period of time.
     * @param period Period of time in seconds.
     */
    /* istanbul ignore next */
    private async updateContractGroups(): Promise<void> {
        if (
            this.schedulerRegistry.getTimeouts().length === 0 &&
            this.updateContractInterval > 0
        ) {
            const callback = async () => {
                if (this.updatedGroups.length === 0) {
                    Logger.log(
                        "GroupsService: no groups to update in the contract"
                    )
                    return
                }

                const tx = await this.zkGroupsContract.updateGroups(
                    this.updatedGroups
                )

                this.updatedGroups = []

                if (tx.status) {
                    Logger.log(
                        `GroupsService: ${tx.logs.length} ${
                            tx.logs.length === 1 ? "group" : "groups"
                        } have been updated in the contract`
                    )
                } else {
                    Logger.error(
                        `GroupsService: failed to update contract groups`
                    )
                }

                this.schedulerRegistry.deleteTimeout("update-contract-groups")
            }
            const timeout = setTimeout(
                callback,
                this.updateContractInterval * 1000
            )

            Logger.log(
                `GroupsService: contract groups are going to be updated in ${this.updateContractInterval} seconds`
            )

            this.schedulerRegistry.addTimeout("update-contract-groups", timeout)
        }
    }
}
