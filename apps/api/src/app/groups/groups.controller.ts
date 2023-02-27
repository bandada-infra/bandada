import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    Request,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import stringifyJSON from "../utils/stringifyJSON"
import { AddMemberDto } from "./dto/add-member.dto"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"
import { mapGroupToResponseDTO } from "./group.utils"
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
        const group = await this.groupsService.createGroup(
            dto,
            req["user"].username
        )

        return mapGroupToResponseDTO(group)
    }

    @Put(":name")
    @UseGuards(AuthGuard("jwt"))
    async updateGroup(
        @Req() req: Request,
        @Param("name") groupName: string,
        @Body() dto: UpdateGroupDto
    ) {
        const group = await this.groupsService.updateGroup(
            dto,
            groupName,
            req["user"].username
        )

        return mapGroupToResponseDTO(group)
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
    async getGroupsByAdmin(@Req() req: Request) {
        const groups = await this.groupsService.getGroupsByAdmin(
            req["user"].username
        )

        return groups.map(mapGroupToResponseDTO)
    }

    @Get(":name")
    async getGroup(@Param("name") groupName: string) {
        const group = await this.groupsService.getGroup(groupName)

        return mapGroupToResponseDTO(group)
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
