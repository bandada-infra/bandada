import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { CreateInviteDto } from "./dto/create-invite.dto"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"

@Controller("invites")
export class InvitesController {
    constructor(private readonly invitesService: InvitesService) {}

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createInvite(
        @Req() req: Request,
        @Body() dto: CreateInviteDto
    ): Promise<string> {
        const { code } = await this.invitesService.createInvite(
            dto,
            req["user"].userId
        )

        return code
    }

    @Get(":code")
    async getInvite(@Param("code") inviteCode: string): Promise<Invite> {
        return this.invitesService.getInvite(inviteCode)
    }
}
