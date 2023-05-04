import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards
} from "@nestjs/common"
import { Request } from "express"
import { AuthGuard } from "../auth/auth.guard"
import { mapEntity } from "../utils"
import { CreateInviteDto } from "./dto/create-invite.dto"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"

@Controller("invites")
export class InvitesController {
    constructor(private readonly invitesService: InvitesService) {}

    @Post()
    @UseGuards(AuthGuard)
    async createInvite(
        @Req() req: Request,
        @Body() dto: CreateInviteDto
    ): Promise<string> {
        const { code } = await this.invitesService.createInvite(
            dto,
            req.session.adminId
        )

        return code
    }

    @Get(":code")
    async getInvite(
        @Param("code") inviteCode: string
    ): Promise<Omit<Invite, "id">> {
        const invite = (await this.invitesService.getInvite(inviteCode)) as any

        invite.groupName = invite.group.name
        invite.groupId = invite.group.id

        return mapEntity(invite)
    }
}
