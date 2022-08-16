import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { GroupData } from "./entities/group.entity";
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from '@semaphore-protocol/group';
import { MerkleProof } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class GroupsService {
    private groups: Group[] = [];

    constructor(
        @InjectRepository(GroupData)
        private readonly groupRepository: MongoRepository<GroupData>
    ) {
        (async () => {
            try{
                const groupsData = await this.groupRepository.find({order:{index:"ASC"}});

                if(groupsData){
                    for(const groupData of groupsData){
                        const group = new Group(groupData.treeDepth);
                        if(groupData.members.length > 0){
                            group.addMembers(groupData.members);
                        }
                        this.groups.push(group);
                    }
                }

                Logger.log(`✔️ GroupModule GroupData in DataBase --> group object sync clear`);
            }catch(e){
                console.error(e.message);
            }
        })();
    }
    
    /**
     * Show all groups data in database.
     * @returns List of existing groups.
     */
    async getAllGroupsData(): Promise<GroupData[]> {
        return await this.groupRepository.find();
    }

    /**
     * Show one specific group data in database.
     * @param groupName Group name wants to find.
     * @returns One group data.
     */
    async getGroupData(groupName: string): Promise<GroupData> {
        const groupData = await this.groupRepository.findOneBy({name: groupName});

        if(!groupData) {
            throw new NotFoundException(`The group: {'${groupName}'} not found.`);
        }

        return groupData;
    }

    /**
     * Create group in database and `Group`(with @semaphore-protocol/group).
     * @param groupData Information for creating group.
     * @returns Created group data.
     */
    async createGroup(groupData:CreateGroupDto): Promise<GroupData>{
        try{
            this.groups.push(new Group(groupData.treeDepth,'0'));

            const newGroupData = this.groupRepository.create({
                index: +(await this.groupRepository.count()),
                admin:"test",
                members:[],
                tag:0,
                ...groupData});

            return await this.groupRepository.save(newGroupData);
        }catch(e){
            this.groups.pop();

            throw new InternalServerErrorException(e.writeErrors);
        }
    }

    /**
     * Check if a member belongs to a group. 
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @returns True or false.
     */
    async isGroupMember(groupName: string, idCommitment: string): Promise<boolean>{
        const groupData = await this.getGroupData(groupName);

        return (groupData.members.includes(idCommitment)) ? true : false;
    }

    /**
     * If a member does not exist in the group, member is added to the database and `Group`(with @semaphore-protocol/group).
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @returns True or false.
     */
    async addMember(groupName:string, idCommitment: string): Promise<boolean>{
        if (!(await this.isGroupMember(groupName,idCommitment))){
            const groupData = await this.getGroupData(groupName);

            groupData.members.push(idCommitment);

            this.groups[groupData.index].addMember(idCommitment);

            return (await this.groupRepository.save(groupData)) ? true : false;
        }
        else{
            throw new BadRequestException(`The member: {'${idCommitment}'} already exists in the group: {'${groupName}'}.`);
        }
    }

    /**
     * Generate a member's merkle proof in `Group`(with @semaphore-protocol/group)
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @returns Member's merkle proof.
     */
    async generateMerkleProof(groupName: string, idCommitment: string): Promise<MerkleProof> {
        if(await this.isGroupMember(groupName,idCommitment)){
            const groupIndex = (await this.getGroupData(groupName)).index;
            const memberIndex = this.groups[groupIndex].indexOf(BigInt(idCommitment));

            return this.groups[groupIndex].generateProofOfMembership(memberIndex);
        }
        else{
            throw new BadRequestException(`The member: {'${idCommitment}'} does not exist in the group: {'${groupName}'}.`);
        }
    }

    /**
     * Can update the name and description of the Group.
     * @param groupName Group name wants to find.
     * @param updateData Information for updating group.
     * @returns True or false.
     */
    async updateGroup(groupName: string, updateData: UpdateGroupDto): Promise<boolean>{
        const _id = (await this.groupRepository.findOneBy({name: groupName}))._id;

        return (await this.groupRepository.updateOne({ _id }, { $set: updateData })) ? true : false;
    }
}
