import { Body, Controller, Post } from "@nestjs/common"
import { AddMemberDto } from "./dto/add-member.dto"
import { OAuthStateDto } from "./dto/oauth-state.dto"
import { ReputationService } from "./reputation.service"

@Controller("reputation")
export class ReputationController {
    constructor(private readonly reputationService: ReputationService) {}

    @Post("oauth-state")
    async setOAuthState(@Body() dto: OAuthStateDto): Promise<string> {
        return this.reputationService.setOAuthState(dto)
    }

    @Post("add-member")
    async addMemberByReputation(
        @Body() dto: AddMemberDto
    ): Promise<void | any> {
        return this.reputationService.addMember(dto.oAuthCode, dto.oAuthState)
    }
}
