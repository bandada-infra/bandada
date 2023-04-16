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
    Request,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { stringifyJSON } from "../utils"
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { mapGroupToResponseDTO } from "./groups.utils"
import { GroupsService } from "./groups.service"

@Controller("groups")
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    async getAllGroups() {
        const groups = await this.groupsService.getAllGroups()

        return groups.map(mapGroupToResponseDTO)
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createGroup(@Req() req: Request, @Body() dto: CreateGroupDto) {
        const group = await this.groupsService.createGroup(dto, req["user"].id)
        return mapGroupToResponseDTO(group)
    }

    @Put(":id")
    @UseGuards(AuthGuard("jwt"))
    async updateGroup(
        @Req() req: Request,
        @Param("id") groupId: string,
        @Body() dto: UpdateGroupDto
    ) {
        const group = await this.groupsService.updateGroup(
            groupId,
            dto,
            req["user"].id
        )

        return mapGroupToResponseDTO(group)
    }

    @Post(":id/members")
    async addMember(
        @Param("id") groupId: string,
        @Body() dto: AddMemberDto,
        @Headers() headers
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
        @Headers() headers
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

        // Remove as admin
        await this.groupsService.removeMember(groupId, memberId, req["user"].id)
    }


    @Get("admin-groups")
    @UseGuards(AuthGuard("jwt"))
    async getGroupsByAdmin(@Req() req: Request) {
        const groups = await this.groupsService.getGroupsByAdmin(req["user"].id)

        return groups.map(mapGroupToResponseDTO)
    }

    // TODO: Make this API public without guards
    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async getGroup(@Param("id") groupId: string, @Req() req: Request) {
        const group = await this.groupsService.getGroup(groupId)

        const response: any = mapGroupToResponseDTO(group)

        if (group.admin === req["user"].id?.toString()) {
            response.apiKey = group.apiKey
            response.apiEnabled = group.apiEnabled
        }

        return response
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
}
