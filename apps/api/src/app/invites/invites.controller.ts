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
        @Body() body: CreateInviteDto
    ): Promise<string> {
        const { code } = await this.invitesService.createInvite(
            body,
            req["user"].userId
        )

        return code
    }

    @Get(":code")
    async getCodeInfo(@Param("code") inviteCode: string): Promise<Invite> {
        const invite = await this.invitesService.getCodeInfo(inviteCode)
        return invite
    }

    @Post("redeem/:code")
    async redeemInvite(@Param("code") inviteCode: string): Promise<void> {
        await this.invitesService.redeemInvite(inviteCode)
    }
}
