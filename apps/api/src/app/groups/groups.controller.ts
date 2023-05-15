import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    Put,
    Req,
    UseGuards
} from "@nestjs/common"
import { Request } from "express"
import { AuthGuard } from "../auth/auth.guard"
import { stringifyJSON } from "../utils"
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { GroupsService } from "./groups.service"
import { mapGroupToResponseDTO } from "./groups.utils"

@Controller("groups")
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    async getAllGroups() {
        const groups = await this.groupsService.getAllGroups()

        return groups.map((g) => mapGroupToResponseDTO(g))
    }

    @Get("admin-groups")
    @UseGuards(AuthGuard)
    async getGroupsByAdmin(@Req() req: Request) {
        const groups = await this.groupsService.getGroupsByAdmin(
            req.session.adminId
        )

        return groups.map((g) => mapGroupToResponseDTO(g))
    }

    @Get(":id")
    async getGroup(@Param("id") groupId: string, @Req() req: Request) {
        const group = await this.groupsService.getGroup(groupId)

        return mapGroupToResponseDTO(
            group,
            req.session.adminId === group.adminId
        )
    }

    @Post()
    @UseGuards(AuthGuard)
    async createGroup(@Req() req: Request, @Body() dto: CreateGroupDto) {
        const group = await this.groupsService.createGroup(
            dto,
            req.session.adminId
        )

        return mapGroupToResponseDTO(
            group,
            req.session.adminId === group.adminId
        )
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async updateGroup(
        @Req() req: Request,
        @Param("id") groupId: string,
        @Body() dto: UpdateGroupDto
    ) {
        const group = await this.groupsService.updateGroup(
            groupId,
            dto,
            req.session.adminId
        )

        return mapGroupToResponseDTO(
            group,
            req.session.adminId === group.adminId
        )
    }

    @Get(":id/members/:member")
    isGroupMember(
        @Param("id") groupId: string,
        @Param("member") member: string
    ): boolean {
        return this.groupsService.isGroupMember(groupId, member)
    }

    @Get(":id/members/:member/proof")
    generateMerkleProof(
        @Param("id") groupId: string,
        @Param("member") member: string
    ): string {
        const merkleProof = this.groupsService.generateMerkleProof(
            groupId,
            member
        )

        return stringifyJSON(merkleProof)
    }

    @Post(":id/members")
    async addMember(
        @Param("id") groupId: string,
        @Body() dto: AddMemberDto,
        @Headers() headers: Headers
    ): Promise<void> {
        if (dto.inviteCode) {
            await this.groupsService.joinGroup(groupId, dto.id, {
                inviteCode: dto.inviteCode
            })

            return
        }

        const apiKey = headers["x-api-key"] as string

        if (apiKey) {
            await this.groupsService.addMemberWithAPIKey(
                groupId,
                dto.id,
                apiKey
            )
            return
        }

        // TODO: Implement admin adding members manually

        throw new Error("Not implemented")
    }

    @Delete(":id/members/:memberId")
    async removeMember(
        @Param("id") groupId: string,
        @Param("memberId") memberId: string,
        @Req() req: Request,
        @Headers() headers: Headers
    ): Promise<void> {
        const apiKey = headers["x-api-key"] as string

        if (apiKey) {
            await this.groupsService.removeMemberWithAPIKey(
                groupId,
                memberId,
                apiKey
            )
            return
        }

        // Remove as an admin.
        await this.groupsService.removeMember(
            groupId,
            memberId,
            req.session.adminId
        )
    }
}
