import { Body, Controller, Delete, Post, Req, Res } from "@nestjs/common"
import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { SignInWithEthereumDTO } from "./dto/siwe-dto"

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("")
    async signIn(@Body() body: SignInWithEthereumDTO, @Res() res: Response) {
        const { token, user } = await this.authService.signIn({
            message: body.message,
            signature: body.signature
        })

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date()
        })

        res.send(user)
    }

    @Delete("")
    logOut(@Req() _req: Request, @Res() res: Response) {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date()
        })

        // TODO: Avoid this redirect here and move to client side
        res.redirect(`${process.env.DASHBOARD_URL}`)
    }
}
