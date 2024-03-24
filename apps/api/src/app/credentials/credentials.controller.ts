import { Body, Controller, Post } from "@nestjs/common"
import { ApiExcludeController } from "@nestjs/swagger"
import { AddMemberDto } from "./dto/add-member.dto"
import { OAuthStateDto } from "./dto/oauth-state.dto"
import { CredentialsService } from "./credentials.service"

@ApiExcludeController()
@Controller("credentials")
export class CredentialsController {
    constructor(private readonly credentialsService: CredentialsService) {}

    @Post("oauth-state")
    async setOAuthState(@Body() dto: OAuthStateDto): Promise<string> {
        return this.credentialsService.setOAuthState(dto)
    }

    @Post()
    async addMemberByCredentials(
        @Body() dto: AddMemberDto
    ): Promise<void | any> {
        return this.credentialsService.addMember(
            dto.oAuthState,
            dto.oAuthCode,
            dto.address
        )
    }
}
