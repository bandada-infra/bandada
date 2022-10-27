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
        @Body() body: CreateInviteDto
    ): Promise<string> {
        const { code } = await this.invitesService.createInvite(
            body,
            req["user"].userId
        )

        return code
    }

    //@Patch(":code")
    //@UseGuards(AuthGuard("jwt"))
    //redeemInvite(
    //@Req() req: Request,
    //@Param("code") code: string
    //): Promise<void> {
    //return this.invitesService.redeemInvite(code, req["user"].userId)
    //}
}
