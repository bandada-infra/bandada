import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "./entities/group.entity"
import { GroupsService } from "./groups.service"
import { MerkleProof } from "./types"

@Controller("groups")
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    getAllGroups(): Promise<Group[]> {
        return this.groupsService.getAllGroups()
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    createGroup(
        @Req() req: Request,
        @Body() groupData: CreateGroupDto
    ): Promise<Group> {
        return this.groupsService.createGroup(groupData, req["user"].userId)
    }

    @Put(":name")
    @UseGuards(AuthGuard("jwt"))
    updateGroup(
        @Req() req: Request,
        @Param("name") groupName: string,
        @Body() updateData: UpdateGroupDto
    ): Promise<Group> {
        return this.groupsService.updateGroup(
            updateData,
            groupName,
            req["user"].userId
        )
    }

    @Get("admin-groups")
    @UseGuards(AuthGuard("jwt"))
    getGroupsByAdmin(@Req() req: Request): Promise<Group[]> {
        return this.groupsService.getGroupsByAdmin(req["user"].userId)
    }

    @Get(":name")
    getGroup(@Param("name") groupName: string): Promise<Group> {
        return this.groupsService.getGroup(groupName)
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
}
