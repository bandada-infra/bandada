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
import {
    ApiBody,
    ApiCreatedResponse,
    ApiExcludeEndpoint,
    ApiHeader,
    ApiOperation,
    ApiQuery,
    ApiTags
} from "@nestjs/swagger"
import { ThrottlerGuard } from "@nestjs/throttler"
import { Request } from "express"
import { AuthGuard } from "../auth/auth.guard"
import { stringifyJSON } from "../utils"
import { Group, MerkleProof } from "./docSchemas"
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { GroupsService } from "./groups.service"
import { mapGroupToResponseDTO } from "./groups.utils"

@ApiTags("groups")
@Controller("groups")
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    @ApiQuery({ name: "adminId", required: false, type: String })
    @ApiOperation({ description: "Returns the list of groups." })
    @ApiCreatedResponse({ type: Group, isArray: true })
    async getGroups(@Query("adminId") adminId: string) {
        const groups = await this.groupsService.getGroups({ adminId })

        return groups.map((g) => mapGroupToResponseDTO(g))
    }

    @Get(":group")
    @ApiOperation({ description: "Returns a specific group." })
    @ApiCreatedResponse({ type: Group })
    async getGroup(@Param("group") groupId: string, @Req() req: Request) {
        const group = await this.groupsService.getGroup(groupId)

        return mapGroupToResponseDTO(
            group,
            req.session.adminId === group.adminId
        )
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiExcludeEndpoint()
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
    @ApiExcludeEndpoint()
    async removeGroup(@Req() req: Request, @Param("group") groupId: string) {
        await this.groupsService.removeGroup(groupId, req.session.adminId)
    }

    @Patch(":group")
    @UseGuards(AuthGuard)
    @ApiExcludeEndpoint()
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

    @Patch(":group/api-key")
    @UseGuards(AuthGuard)
    @UseGuards(ThrottlerGuard)
    @ApiExcludeEndpoint()
    async updateApiKey(@Req() req: Request, @Param("group") groupId: string) {
        return this.groupsService.updateApiKey(groupId, req.session.adminId)
    }

    @Get(":group/members/:member")
    @ApiOperation({
        description:
            "Returns true if the member is in the group and false otherwise."
    })
    @ApiCreatedResponse({ type: Boolean })
    isGroupMember(
        @Param("group") groupId: string,
        @Param("member") memberId: string
    ): boolean {
        return this.groupsService.isGroupMember(groupId, memberId)
    }

    @Get(":group/members/:member/proof")
    @ApiOperation({
        description: "Returns the Merkle Proof for a member in a group."
    })
    @ApiCreatedResponse({ type: MerkleProof })
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
    @ApiBody({ required: false, type: AddMemberDto })
    @ApiHeader({ name: "x-api-key", required: false })
    @ApiOperation({
        description:
            "Adds a member to a group using an API Key or an Invite Code."
    })
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
    @ApiHeader({ name: "x-api-key", required: true })
    @ApiOperation({
        description: "Removes a member from a group using an API Key."
    })
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
        await this.groupsService.removeMemberManually(
            groupId,
            memberId,
            req.session.adminId
        )
    }
}
