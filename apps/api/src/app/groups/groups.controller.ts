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
            dto,
            groupId,
            req["user"].id
        )

        return mapGroupToResponseDTO(group)
    }

    @Get(":id/api-config")
    @UseGuards(AuthGuard("jwt"))
    async getAPIConfig(@Req() req: Request, @Param("id") groupId: string) {
        const config = await this.groupsService.getAPIConfig(
            groupId,
            req["user"].id
        )

        return config
    }

    @Post(":id/api-config")
    @UseGuards(AuthGuard("jwt"))
    async enableAPI(
        @Req() req: Request,
        @Param("id") groupId: string,
        @Body() dto: { isEnabled: boolean }
    ) {
        const config = await this.groupsService.enableAPI(
            groupId,
            dto.isEnabled,
            req["user"].id
        )

        return config
    }

    @Post(":id/add-member")
    async addMember(
        @Param("id") groupId: string,
        @Body() dto: { id: string },
        @Headers() headers
    ): Promise<void> {
        const apiKey = headers["x-api-key"] as string

        await this.groupsService.addMemberWithAPIKey(groupId, dto.id, apiKey)

        // TODO: Implement admin adding members manually
    }

    @Post(":id/:member")
    async joinGroup(
        @Param("id") groupId: string,
        @Param("member") member: string,
        @Body() dto: AddMemberDto
    ): Promise<void> {
        await this.groupsService.joinGroup(dto, groupId, member)
    }

    @Get("admin-groups")
    @UseGuards(AuthGuard("jwt"))
    async getGroupsByAdmin(@Req() req: Request) {
        const groups = await this.groupsService.getGroupsByAdmin(req["user"].id)

        return groups.map(mapGroupToResponseDTO)
    }

    @Get(":id")
    async getGroup(@Param("id") groupId: string) {
        const group = await this.groupsService.getGroup(groupId)

        return mapGroupToResponseDTO(group)
    }

    @Get(":id/:member")
    isGroupMember(
        @Param("id") groupId: string,
        @Param("member") member: string
    ): boolean {
        return this.groupsService.isGroupMember(groupId, member)
    }

    @Get(":id/:member/proof")
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

    @Delete(":id/:member")
    @UseGuards(AuthGuard("jwt"))
    async removeMember(
        @Req() req: Request,
        @Param("id") groupId: string,
        @Param("member") member: string
    ): Promise<void> {
        await this.groupsService.removeMember(groupId, member, req["user"].id)
    }
}
