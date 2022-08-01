import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupData } from './entities/group.entity';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { MerkleProof } from './types';

@Controller('groups')
export class GroupsController {
    
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    getAllGroups(): GroupData[]{
        return this.groupsService.getAllGroupsData();
    }

    @Post()
    // @todo need jwt auth guard
    createGroup(@Body() groupData: CreateGroupDto){
        return this.groupsService.createGroup(groupData);
    }

    @Get(':name')
    getGroup(@Param('name') groupName: string): GroupData {
        return this.groupsService.getGroupData(groupName);
    }

    @Get(':name/:member')
    isGroupMember(@Param('name') groupName: string,@Param('member') idCommitment: string): boolean{
        return this.groupsService.isGroupMember(groupName,idCommitment);
    }

    @Post(':name/:member')
    // @todo need jwt auth guard
    addMember(@Param('name') groupName: string, @Param('member') idCommitment: string){
        return this.groupsService.addMember(groupName, idCommitment);
    }

    @Get(':name/:member/proof')
    generateMerkleProof(@Param('name') groupName: string, @Param('member') idCommitment: string): MerkleProof{
        return this.groupsService.generateMerkleProof(groupName,idCommitment);
    }

    @Patch(':name')
    // @todo need jwt auth guard
    updateGroup(@Param('name') groupName: string, @Body() updateData: UpdateGroupDto){
        return this.groupsService.updateGroup(groupName,updateData);
    }
}
