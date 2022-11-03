import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { CreateInviteDto } from "./dto/create-invite.dto"
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
}
