import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    NotImplementedException,
    Param,
    Patch,
    Post,
    Query,
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
    async getGroups(@Query("adminId") adminId: string) {
        const groups = await this.groupsService.getGroups({ adminId })

        return groups.map((g) => mapGroupToResponseDTO(g))
    }

    @Get(":group")
    async getGroup(@Param("group") groupId: string, @Req() req: Request) {
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

    @Delete(":group")
    @UseGuards(AuthGuard)
    async removeGroup(@Req() req: Request, @Param("group") groupId: string) {
        await this.groupsService.removeGroup(groupId, req.session.adminId)
    }

    @Patch(":group")
    @UseGuards(AuthGuard)
    async updateGroup(
        @Req() req: Request,
        @Param("group") groupId: string,
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

    @Get(":group/members/:member")
    isGroupMember(
        @Param("group") groupId: string,
        @Param("member") memberId: string
    ): boolean {
        return this.groupsService.isGroupMember(groupId, memberId)
    }

    @Get(":group/members/:member/proof")
    generateMerkleProof(
        @Param("group") groupId: string,
        @Param("member") member: string
    ): string {
        const merkleProof = this.groupsService.generateMerkleProof(
            groupId,
            member
        )

        return stringifyJSON(merkleProof)
    }

    @Post(":group/members/:member")
    async addMember(
        @Param("group") groupId: string,
        @Param("member") memberId: string,
        @Body() dto: AddMemberDto,
        @Headers() headers: Headers,
        @Req() req: Request
    ): Promise<void | any> {
        if (dto.inviteCode) {
            await this.groupsService.joinGroup(groupId, memberId, {
                inviteCode: dto.inviteCode
            })

            return
        }

        const apiKey = headers["x-api-key"] as string

        if (apiKey) {
            await this.groupsService.addMemberWithAPIKey(
                groupId,
                memberId,
                apiKey
            )
            return
        }

        if (req.session.adminId) {
            await this.groupsService.addMemberManually(
                groupId,
                memberId,
                req.session.adminId
            )

            return
        }

        throw new NotImplementedException()
    }

    @Delete(":group/members/:member")
    async removeMember(
        @Param("group") groupId: string,
        @Param("member") memberId: string,
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
