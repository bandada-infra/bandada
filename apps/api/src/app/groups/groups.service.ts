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
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "./entities/group.entity"
import { MerkleProof } from "./types"
import { SchedulerRegistry } from "@nestjs/schedule"
import { updateOffchainGroups } from "@zk-groups/onchain"
@Injectable()
export class GroupsService {
    private cachedGroups: Map<string, CachedGroup>
    private updatedGroups: Map<string, any[]>

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @Inject(forwardRef(() => InvitesService))
        private readonly invitesService: InvitesService,
        private schedulerRegistry: SchedulerRegistry
    ) {
        ;(async () => {
            this.cachedGroups = new Map()
            const groups = await this.getAllGroups()

            /* istanbul ignore next */
            for (const group of groups) {
                const cachedGroup = new CachedGroup(group.treeDepth)

                cachedGroup.addMembers(group.members)

                this.cachedGroups.set(group.name, cachedGroup)
            }

            Logger.log(
                `GroupsService: ${groups.length} groups have been cached`
            )
        })()
    }

    /**
     * Save the updated group's merkle root in the ZKGroups contract.
     */
    /* istanbul ignore next */
    addTimeout() {
        const period = 60 * 1000 //1 minute

        const callback = async () => {
            Logger.log(`GroupsService: (Task) Save off-chain group roots start`)

            if (this.updatedGroups.size > 0) {
                const groups = new Map(this.updatedGroups)
                this.updatedGroups.clear()

                const transaction = await updateOffchainGroups(groups)

                if (transaction.status) {
                    Logger.log(
                        `GroupsService: (Task) Merkle roots of ${transaction.events.length} groups have been published on-chain`
                    )
                } else {
                    Logger.error(
                        `GroupsService: (Task) Failed to save merkle roots on-chain`
                    )
                }
            }

            this.schedulerRegistry.deleteTimeout("Save off-chain group roots")
        }

        const timeout = setTimeout(callback, period)
        this.schedulerRegistry.addTimeout("Save off-chain group roots", timeout)

        Logger.log(
            `GroupsService: (Task) Off-chain roots update after ${
                period / 1000
            } seconds`
        )
    }

    /**
     * Creates a new group.
     * @param dto External parameters used to create a new group.
     * @param admin Admin id from jwt auth.
     * @returns Created group.
     */
    async createGroup(
        { name, description, treeDepth, tag }: CreateGroupDto,
        admin: string
    ): Promise<Group> {
        const group = this.groupRepository.create({
            name,
            description,
            treeDepth,
            tag,
            admin: admin,
            members: []
        })

        await this.groupRepository.save(group)

        const cachedGroup = new CachedGroup(treeDepth)

        this.cachedGroups.set(name, cachedGroup)

        Logger.log(`GroupsService: group '${name}' has been created`)

        return group
    }

    /**
     * Updates some parameters of the group.
     * @param dto External parameters used to update a group.
     * @param groupName Group name.
     * @param admin Admin id from jwt auth.
     * @returns Updated group.
     */
    async updateGroup(
        { description, treeDepth, tag }: UpdateGroupDto,
        groupName: string,
        admin: string
    ): Promise<Group> {
        const group = await this.getGroup(groupName)

        if (group.admin !== admin) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupName}'`
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
     * @param groupName Group name.
     * @param member Member's identity commitment.
     * @returns Group data with added member.
     */
    async addMember(
        { inviteCode }: AddMemberDto,
        groupName: string,
        member: string
    ): Promise<Group> {
        if (this.isGroupMember(groupName, member)) {
            throw new BadRequestException(
                `Member '${member}' already exists in the group '${groupName}'`
            )
        }

        await this.invitesService.redeemInvite(inviteCode, groupName)

        const group = await this.getGroup(groupName)

        group.members.push(member)

        await this.groupRepository.save(group)

        const cachedGroup = this.cachedGroups.get(groupName)

        cachedGroup.addMember(member)

        Logger.log(
            `GroupsService: member '${member}' has been added to the group '${group.name}'`
        )

        if (this.updatedGroups === undefined) {
            this.updatedGroups = new Map()
        }

        this.updatedGroups.set(groupName, [cachedGroup.root, cachedGroup.depth])

        if (this.schedulerRegistry.getTimeouts().length === 0) {
            this.addTimeout()
        }

        return group
    }

    /**
     * Returns a list of groups.
     * @returns List of existing groups.
     */
    async getAllGroups(): Promise<Group[]> {
        return await this.groupRepository.find()
    }

    /**
     * Returns a list of groups of a specific admin.
     * @param admin Admin id from jwt auth.
     * @returns List of admin's existing groups.
     */
    async getGroupsByAdmin(admin: string): Promise<Group[]> {
        return await this.groupRepository.findBy({ admin })
    }

    /**
     * Returns a specific group.
     * @param groupName Group name.
     * @returns Specific group.
     */
    async getGroup(groupName: string): Promise<Group> {
        const group = await this.groupRepository.findOneBy({
            name: groupName
        })

        if (!group) {
            throw new NotFoundException(`Group '${groupName}' does not exist`)
        }

        return group
    }

    /**
     * Checks if a member belongs to a group.
     * @param groupName Group name.
     * @param member Member's identity commitment.
     * @returns True or false.
     */
    isGroupMember(groupName: string, member: string): boolean {
        const cachedGroup = this.cachedGroups.get(groupName)

        return cachedGroup.indexOf(BigInt(member)) !== -1
    }

    /**
     * Generates a proof of membership.
     * @param groupName Group name.
     * @param member Member's identity commitment.
     * @returns Merkle proof.
     */
    generateMerkleProof(groupName: string, member: string): MerkleProof {
        if (!this.isGroupMember(groupName, member)) {
            throw new BadRequestException(
                `Member '${member}' does not exist in the group '${groupName}'`
            )
        }

        const cachedGroup = this.cachedGroups.get(groupName)
        const memberIndex = cachedGroup.indexOf(BigInt(member))

        return cachedGroup.generateProofOfMembership(memberIndex)
    }
}
