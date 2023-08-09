import { Body, Controller, Delete, Get, Post, Req } from "@nestjs/common"
import { Request } from "express"
import { generateNonce } from "siwe"
import { ApiExcludeController } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { SignInWithEthereumDTO } from "./dto/siwe.dto"

@ApiExcludeController()
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("nonce")
    async nonce(@Req() req: Request) {
        req.session.nonce = generateNonce()

        await req.session.save()

        return req.session.nonce
    }

    @Get()
    async(@Req() req: Request) {
        return this.authService.isLoggedIn(req.session.adminId)
    }

    @Post("")
    async signIn(@Body() body: SignInWithEthereumDTO, @Req() req: Request) {
        const { admin } = await this.authService.signIn(
            {
                message: body.message,
                signature: body.signature
            },
            req.session.nonce
        )

        req.session.adminId = admin.id

        await req.session.save()

        return admin
    }

    @Delete("")
    logOut(@Req() req: Request) {
        req.session.destroy()
    }
}
