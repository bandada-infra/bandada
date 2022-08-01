import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GroupData } from "./entities/group.entity";
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from '@semaphore-protocol/group';
import { MerkleProof } from './types';

@Injectable()
export class GroupsService {
    private groupsData: GroupData[] = [];
    private groups: Group[] = [];

    /**
     * Show all groups data in database.
     * @returns List of existing groups.
     */
    getAllGroupsData(): GroupData[] {
        return this.groupsData;
    }

    /**
     * Show one specific group data in database.
     * @param groupName Group name wants to find.
     * @returns One group data.
     */
    getGroupData(groupName: string): GroupData {
        const groupData = this.groupsData.find(group => group.name === groupName);
        
        if(!groupData) {
            throw new NotFoundException(`Group with "${groupName}" not found.`);
        }
        return groupData;
    }

    /**
     * Create group in database and `Group`(with @semaphore-protocol/group).
     * @param groupData Information for creating group.
     */
    createGroup(groupData:CreateGroupDto){
        this.groupsData.push({
            id: this.groupsData.length,
            admin:"dev",
            members:[],
            createdAt: Date.now(),
            ...groupData,
        });

        this.groups.push(new Group(groupData.treeDepth));
    }

    /**
     * Check if a member belongs to a group. 
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @returns True or false.
     */
    isGroupMember(groupName: string, idCommitment: string): boolean{
        const groupIndex = this.getGroupData(groupName).id;

        if (this.groups[groupIndex].indexOf(BigInt(idCommitment)) >= 0){
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * If a member does not exist in the group, member is added to the database and `Group`(with @semaphore-protocol/group).
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     */
    addMember(groupName:string, idCommitment: string){
        if (!this.isGroupMember(groupName,idCommitment)){
            const groupIndex = this.getGroupData(groupName).id;
            
            this.groupsData[groupIndex].members.push(BigInt(idCommitment));
            this.groups[groupIndex].addMember(BigInt(idCommitment));
        }
        else{
            throw new BadRequestException("The member already exists in the group.");
        }
    }

    /**
     * Generate a member's merkle proof in `Group`(with @semaphore-protocol/group)
     * @param groupName Group name wants to find.
     * @param idCommitment Member's identity commitment.
     * @returns Member's merkle proof.
     */
    generateMerkleProof(groupName: string, idCommitment: string): MerkleProof {
        if(this.isGroupMember(groupName,idCommitment)){
            const groupIndex = this.getGroupData(groupName).id;
            const memberIndex = this.groups[groupIndex].indexOf(BigInt(idCommitment));

            return this.groups[groupIndex].generateProofOfMembership(memberIndex);
        }
        else{
            throw new BadRequestException("The member does not exist in the group.");
        }
    }

    /**
     * Can update the name and description of the Group.
     * @param groupName Group name wants to find.
     * @param updateData Information for updating group.
     */
    updateGroup(groupName: string, updateData: UpdateGroupDto){
        const groupData = this.getGroupData(groupName);
        this.groupsData = this.groupsData.filter(groupData => groupData.name !== groupName);
        this.groupsData.push({...groupData,...updateData});
    }
}
