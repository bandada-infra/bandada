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
import { Request } from "express"
import { AuthGuard } from "../auth/auth.guard"
import { stringifyJSON } from "../utils"
import { Group, MerkleProof } from "./docSchemas"
import { AddMemberDto } from "./dto/add-member.dto"
import { AddMembersDto } from "./dto/add-members.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { RemoveMembersDto } from "./dto/remove-members.dto"
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
        const groupIds = groups.map((group) => group.id)
        const fingerprints = await this.groupsService.getFingerprints(groupIds)

        return groups.map((group, index) =>
            mapGroupToResponseDTO(group, fingerprints[index])
        )
    }

    @Get(":group")
    @ApiOperation({ description: "Returns a specific group." })
    @ApiCreatedResponse({ type: Group })
    async getGroup(@Param("group") groupId: string) {
        const group = await this.groupsService.getGroup(groupId)
        const fingerprint = await this.groupsService.getFingerprint(groupId)

        return mapGroupToResponseDTO(group, fingerprint)
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiExcludeEndpoint()
    async createGroup(@Req() req: Request, @Body() dto: CreateGroupDto) {
        const group = await this.groupsService.createGroup(
            dto,
            req.session.adminId
        )
        const fingerprint = await this.groupsService.getFingerprint(group.id)

        return mapGroupToResponseDTO(group, fingerprint)
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

        const fingerprint = await this.groupsService.getFingerprint(groupId)

        return mapGroupToResponseDTO(group, fingerprint)
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
            "Adds a member to a group using an API Key or an Invite Code.\n\nNote:\n\nUse only the API Key or the Invite Code, do not use both at the same time.\n\nMake sure that the one that is not being used is empty. Then if using the API Key, remove the Request body to leave it empty and if using the Invite Code, make sure the API Key box is empty."
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

    @Post(":group/members")
    @ApiBody({ type: AddMembersDto })
    @ApiHeader({ name: "x-api-key", required: true })
    @ApiOperation({
        description:
            "Adds multiple members to a group. Requires either API Key in the headers or a valid session."
    })
    async addMembers(
        @Param("group") groupId: string,
        @Body() dto: AddMembersDto,
        @Headers() headers: Headers,
        @Req() req: Request
    ): Promise<void | any> {
        const apiKey = headers["x-api-key"] as string

        if (apiKey) {
            await this.groupsService.addMembersWithAPIKey(
                groupId,
                dto.memberIds,
                apiKey
            )
            return
        }

        if (req.session.adminId) {
            await this.groupsService.addMembersManually(
                groupId,
                dto.memberIds,
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

    @Delete(":group/members")
    @ApiBody({ type: RemoveMembersDto })
    @ApiHeader({ name: "x-api-key", required: true })
    @ApiOperation({
        description: "Removes members from a group using an API Key."
    })
    async removeMembers(
        @Param("group") groupId: string,
        @Body() dto: RemoveMembersDto,
        @Req() req: Request,
        @Headers() headers: Headers
    ): Promise<void> {
        const apiKey = headers["x-api-key"] as string

        if (apiKey) {
            await this.groupsService.removeMembersWithAPIKey(
                groupId,
                dto.memberIds,
                apiKey
            )
            return
        }

        // Remove as an admin.
        await this.groupsService.removeMembersManually(
            groupId,
            dto.memberIds,
            req.session.adminId
        )
    }
}
