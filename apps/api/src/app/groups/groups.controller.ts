import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
} from "@nestjs/common"
import { GroupsService } from "./groups.service"
import { GroupData } from "./entities/group.entity"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { MerkleProof } from "./types"
import { UpdateWriteOpResult } from "typeorm"
import { AuthGuard } from "@nestjs/passport"

@Controller("groups")
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    getAllGroups(): Promise<GroupData[]> {
        return this.groupsService.getAllGroupsData()
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    createGroup(
        @Req() req: Request,
        @Body() groupData: CreateGroupDto
    ): Promise<GroupData> {
        return this.groupsService.createGroup(groupData, req["user"].userId)
    }

    @Get("admin-groups")
    @UseGuards(AuthGuard("jwt"))
    getGroupsByAdmin(@Req() req: Request): Promise<GroupData[]> {
        return this.groupsService.getGroupsByAdmin(req["user"].userId)
    }

    @Get(":name")
    getGroup(@Param("name") groupName: string): Promise<GroupData> {
        return this.groupsService.getGroupData(groupName)
    }

    @Get(":name/:member")
    isGroupMember(
        @Param("name") groupName: string,
        @Param("member") idCommitment: string
    ): Promise<boolean> {
        return this.groupsService.isGroupMember(groupName, idCommitment)
    }

    @Post(":name/:member/:invite-code")
    async addMember(
        @Param("name") groupName: string,
        @Param("member") idCommitment: string,
        @Param("invite-code") inviteCode: string
    ): Promise<void> {
        await this.groupsService.addMember(groupName, idCommitment, inviteCode)
    }

    @Get(":name/:member/proof")
    generateMerkleProof(
        @Param("name") groupName: string,
        @Param("member") idCommitment: string
    ): Promise<MerkleProof> {
        BigInt.prototype["toJSON"] = function () {
            return this.toString()
        }
        return this.groupsService.generateMerkleProof(groupName, idCommitment)
    }

    @Patch(":name")
    @UseGuards(AuthGuard("jwt"))
    updateGroup(
        @Req() req: Request,
        @Param("name") groupName: string,
        @Body() updateData: UpdateGroupDto
    ): Promise<UpdateWriteOpResult> {
        return this.groupsService.updateGroup(
            groupName,
            updateData,
            req["user"].userId
        )
    }
}