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
import { stringifyJSON } from "../common/utils"
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { Group } from "./entities/group.entity"
import { GroupsService } from "./groups.service"

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
        @Body() dto: CreateGroupDto
    ): Promise<Group> {
        return this.groupsService.createGroup(dto, req["user"].userId)
    }

    @Put(":name")
    @UseGuards(AuthGuard("jwt"))
    updateGroup(
        @Req() req: Request,
        @Param("name") groupName: string,
        @Body() dto: UpdateGroupDto
    ): Promise<Group> {
        return this.groupsService.updateGroup(
            dto,
            groupName,
            req["user"].userId
        )
    }

    @Post(":name/:member")
    async addMember(
        @Param("name") groupName: string,
        @Param("member") member: string,
        @Body() dto: AddMemberDto
    ): Promise<void> {
        await this.groupsService.addMember(dto, groupName, member)
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
        @Param("member") member: string
    ): boolean {
        return this.groupsService.isGroupMember(groupName, member)
    }

    @Get(":name/:member/proof")
    generateMerkleProof(
        @Param("name") groupName: string,
        @Param("member") member: string
    ): string {
        const merkleProof = this.groupsService.generateMerkleProof(
            groupName,
            member
        )

        return stringifyJSON(merkleProof)
    }
}
