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
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "./entities/group.entity"
import { MerkleProof } from "./types"

@Injectable()
export class GroupsService {
    private cachedGroups: CachedGroup[] = []

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @Inject(forwardRef(() => InvitesService))
        private readonly invitesService: InvitesService
    ) {
        ;(async () => {
            const groups = await this.groupRepository.find({
                order: { index: "ASC" }
            })

            /* istanbul ignore next */
            if (groups) {
                for (const group of groups) {
                    const cachedGroup = new CachedGroup(group.treeDepth)

                    if (group.members.length > 0) {
                        cachedGroup.addMembers(group.members)
                    }

                    this.cachedGroups.push(cachedGroup)
                }
            }

            Logger.log(
                `✔️ GroupModule GroupData in DataBase --> @semaphore-protocol/group object sync clear`
            )
        })()
    }

    /**
     * Creates a new group.
     * @param dto External parameters used to create a new group.
     * @param admin Admin id from jwt auth.
     * @returns Created group data.
     */
    async createGroup(dto: CreateGroupDto, admin: string): Promise<Group> {
        const group = this.groupRepository.create({
            index: +(await this.groupRepository.count()),
            admin: admin,
            members: [],
            ...dto
        })

        await this.groupRepository.save(group)

        this.cachedGroups.push(new CachedGroup(group.treeDepth))

        return group
    }

    /**
     * Updates some parameters of the group.
     * @param dto External parameters used to update a group.
     * @param groupName Group name wants to find.
     * @param admin Admin id from jwt auth.
     * @returns True or false.
     */
    async updateGroup(
        dto: UpdateGroupDto,
        groupName: string,
        admin: string
    ): Promise<Group> {
        const group = await this.getGroup(groupName)

        if (group.admin !== admin) {
            throw new UnauthorizedException(
                `No permissions: You are not an admin of this group: {'${groupName}'}.`
            )
        }

        group.description = dto.description
        group.treeDepth = dto.treeDepth
        group.tag = dto.tag

        return this.groupRepository.save(group)
    }

    /**
     * Returns a list of groups.
     * @returns List of existing groups.
     */
    async getAllGroups(): Promise<Group[]> {
        return await this.groupRepository.find()
    }

    /**
     * Show admin's groups data in database.
     * @param admin Admin id from jwt auth.
     * @returns List of admin's existing groups.
     */
    async getGroupsByAdmin(admin: string): Promise<Group[]> {
        return await this.groupRepository.findBy({ admin })
    }

    /**
     * Show one specific group data in database.
     * @param groupName Group name wants to find.
     * @returns One group data.
     */
    async getGroup(groupName: string): Promise<Group> {
        const group = await this.groupRepository.findOneBy({
            name: groupName
        })

        if (!group) {
            throw new NotFoundException(
                `The group: {'${groupName}'} not found.`
            )
        }

        return group
    }

    /**
     * Check if a member belongs to a group.
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @returns True or false.
     */
    async isGroupMember(
        groupName: string,
        idCommitment: string
    ): Promise<boolean> {
        const group = await this.getGroup(groupName)

        return group.members.includes(idCommitment)
    }

    /**
     * If a member does not exist in the group, member is added to the database and `Group`(with @semaphore-protocol/group).
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @param inviteCode Invite code needed to add a new member.
     * @returns Group data with added member.
     */
    async addMember(
        groupName: string,
        idCommitment: string,
        inviteCode: string
    ): Promise<Group> {
        if (await this.isGroupMember(groupName, idCommitment)) {
            throw new BadRequestException(
                `The member: {'${idCommitment}'} already exists in the group: {'${groupName}'}.`
            )
        }

        this.invitesService.redeemInvite(inviteCode)

        const group = await this.getGroup(groupName)

        group.members.push(idCommitment)

        this.cachedGroups[group.index].addMember(idCommitment)

        return this.groupRepository.save(group)
    }

    /**
     * Generate a member's merkle proof in `Group`(with @semaphore-protocol/group)
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @returns Member's merkle proof.
     */
    async generateMerkleProof(
        groupName: string,
        idCommitment: string
    ): Promise<MerkleProof> {
        if (!(await this.isGroupMember(groupName, idCommitment))) {
            throw new BadRequestException(
                `The member: {'${idCommitment}'} does not exist in the group: {'${groupName}'}.`
            )
        }

        const groupIndex = (await this.getGroup(groupName)).index
        const memberIndex = this.cachedGroups[groupIndex].indexOf(
            BigInt(idCommitment)
        )

        return this.cachedGroups[groupIndex].generateProofOfMembership(
            memberIndex
        )
    }
}
