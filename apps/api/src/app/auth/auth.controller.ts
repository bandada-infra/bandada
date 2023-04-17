import {
    Body,
    Controller,
    Delete,
    Post,
    Req,
    Res,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { SignInWithEthereumDTO } from "./dto/create-account.dto"

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("")
    signIn(
        @Body() body: SignInWithEthereumDTO
    ) {
        this.authService.signIn({
            message: body.message,
            signature: body.signature
        })
    }

    @Delete("")
    logOut(@Req() _req: Request, @Res() res: Response) {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date()
        })

        // TODO: Avoid this redirect here and move to client side
        res.redirect(`${process.env.DASHBOARD_URL}`)
    }
}
