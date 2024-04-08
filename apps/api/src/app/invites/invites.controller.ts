import {
    Body,
    Controller,
    Get,
    Headers,
    NotImplementedException,
    Param,
    Post,
    Req
} from "@nestjs/common"
import {
    ApiBody,
    ApiCreatedResponse,
    ApiHeader,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger"
// import { ThrottlerGuard } from "@nestjs/throttler"
import { Request } from "express"
import { InviteResponse } from "../groups/docSchemas"
import { CreateInviteDto } from "./dto/create-invite.dto"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"
import { mapEntity } from "../utils"

@ApiTags("invites")
@Controller("invites")
export class InvitesController {
    constructor(private readonly invitesService: InvitesService) {}

    @Post()
    // @UseGuards(ThrottlerGuard)
    @ApiBody({ type: CreateInviteDto })
    @ApiHeader({ name: "x-api-key", required: true })
    @ApiCreatedResponse({ type: InviteResponse })
    @ApiOperation({
        description: "Creates a new group invite with a unique code."
    })
    async createInvite(
        @Headers() headers: Headers,
        @Req() req: Request,
        @Body() dto: CreateInviteDto
    ): Promise<InviteResponse> {
        let invite: Invite

        const apiKey = headers["x-api-key"] as string

        if (apiKey) {
            invite = await this.invitesService.createInviteWithApiKey(
                dto,
                apiKey
            )
        } else if (req.session.adminId) {
            invite = await this.invitesService.createInviteManually(
                dto,
                req.session.adminId
            )
        } else {
            throw new NotImplementedException()
        }

        return mapEntity(invite)
    }

    @Get(":code")
    @ApiOperation({ description: "Returns a specific invite." })
    @ApiCreatedResponse({ type: InviteResponse })
    async getInvite(
        @Param("code") inviteCode: string
    ): Promise<InviteResponse> {
        const invite = await this.invitesService.getInvite(inviteCode)

        return mapEntity(invite)
    }
}
