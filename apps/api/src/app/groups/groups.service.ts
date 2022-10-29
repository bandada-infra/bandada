import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common"
import { GroupData } from "./entities/group.entity"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "@semaphore-protocol/group"
import { MerkleProof } from "./types"
import { InjectRepository } from "@nestjs/typeorm"
import { MongoRepository, UpdateWriteOpResult } from "typeorm"
import { InvitesService } from "../invites/invites.service"

@Injectable()
export class GroupsService {
    private groups: Group[] = []

    constructor(
        @InjectRepository(GroupData)
        private readonly groupRepository: MongoRepository<GroupData>,
        @Inject(forwardRef(() => InvitesService))
        private readonly invitesService: InvitesService
    ) {
        ;(async () => {
            const groupsData = await this.groupRepository.find({
                order: { index: "ASC" }
            })
            this.groups = []

            if (groupsData) {
                for (const groupData of groupsData) {
                    const group = new Group(groupData.treeDepth)
                    if (groupData.members.length > 0) {
                        group.addMembers(groupData.members)
                    }
                    this.groups.push(group)
                }
            }

            Logger.log(
                `✔️ GroupModule GroupData in DataBase --> @semaphore-protocol/group object sync clear`
            )
        })()
    }

    /**
     * Show all groups data in database.
     * @returns List of existing groups.
     */
    async getAllGroupsData(): Promise<GroupData[]> {
        return await this.groupRepository.find()
    }

    /**
     * Show admin's groups data in database.
     * @param adminUserId account userId from jwt auth.
     * @returns List of admin's existing groups.
     */
    async getGroupsByAdmin(adminUserId: string): Promise<GroupData[]> {
        return await this.groupRepository.findBy({ admin: adminUserId })
    }

    /**
     * Show one specific group data in database.
     * @param groupName Group name wants to find.
     * @returns One group data.
     */
    async getGroupData(groupName: string): Promise<GroupData> {
        const groupData = await this.groupRepository.findOneBy({
            name: groupName
        })

        if (!groupData) {
            throw new NotFoundException(
                `The group: {'${groupName}'} not found.`
            )
        }

        return groupData
    }

    /**
     * Create group in database and `Group`(with @semaphore-protocol/group).
     * @param groupData Information for creating group.
     * @param adminUserId account userId from jwt auth.
     * @returns Created group data.
     */
    async createGroup(
        groupData: CreateGroupDto,
        adminUserId: string
    ): Promise<GroupData> {
        try {
            this.groups.push(new Group(groupData.treeDepth))

            const newGroupData = this.groupRepository.create({
                index: +(await this.groupRepository.count()),
                admin: adminUserId,
                members: [],
                tag: 0,
                ...groupData
            })

            return await this.groupRepository.save(newGroupData)
        } catch (e) {
            this.groups.pop()

            throw new InternalServerErrorException(e.writeErrors)
        }
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
        const groupData = await this.getGroupData(groupName)

        return groupData.members.includes(idCommitment) ? true : false
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
    ): Promise<GroupData> {
        if (await this.isGroupMember(groupName, idCommitment)) {
            throw new BadRequestException(
                `The member: {'${idCommitment}'} already exists in the group: {'${groupName}'}.`
            )
        }

        this.invitesService.redeemInvite(inviteCode)

        const groupData = await this.getGroupData(groupName)

        groupData.members.push(idCommitment)

        this.groups[groupData.index].addMember(idCommitment)

        return this.groupRepository.save(groupData)
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
        if (await this.isGroupMember(groupName, idCommitment)) {
            const groupIndex = (await this.getGroupData(groupName)).index
            const memberIndex = this.groups[groupIndex].indexOf(
                BigInt(idCommitment)
            )

            return this.groups[groupIndex].generateProofOfMembership(
                memberIndex
            )
        } else {
            throw new BadRequestException(
                `The member: {'${idCommitment}'} does not exist in the group: {'${groupName}'}.`
            )
        }
    }

    /**
     * Can update the name and description of the Group.
     * @param groupName Group name wants to find.
     * @param updateData Information for updating group.
     * @param adminUserId account userId from jwt auth.
     * @returns True or false.
     */
    async updateGroup(
        groupName: string,
        updateData: UpdateGroupDto,
        adminUserId: string
    ): Promise<UpdateWriteOpResult> {
        const groupData = await this.getGroupData(groupName)

        if (groupData.admin !== adminUserId) {
            throw new UnauthorizedException(
                `No permissions: You are not an admin of this group: {'${groupName}'}.`
            )
        }

        return await this.groupRepository.updateOne(
            { _id: groupData._id },
            { $set: updateData }
        )
    }
}
