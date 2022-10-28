import {
    Controller,
    Get,
    Req,
    Res,
    UnauthorizedException,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Response, Request } from "express"

@Controller("auth")
export class AuthController {
    @Get("github")
    @UseGuards(AuthGuard("github"))
    github() {
        throw new UnauthorizedException()
    }

    @Get("github/callback")
    @UseGuards(AuthGuard("github"))
    githubCallback(@Req() req: Request, @Res() res: Response) {
        const jwtToken = req["user"]
        if (jwtToken) {
            res.cookie("jwt", jwtToken, {
                httpOnly: false, //@todo: make true for security
                maxAge: 24 * 60 * 60 * 1000
            })
        }
        res.redirect(`${process.env.DASHBOARD_URL}/my-groups`)
    }

    @Get("twitter")
    @UseGuards(AuthGuard("twitter"))
    twitter() {
        throw new UnauthorizedException()
    }

    @Get("twitter/callback")
    @UseGuards(AuthGuard("twitter"))
    twitterCallback(@Req() req: Request, @Res() res: Response) {
        const jwtToken = req["user"]
        if (jwtToken) {
            res.cookie("jwt", jwtToken, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000
            })
        }
        res.redirect(`${process.env.DASHBOARD_URL}/my-groups`)
    }

    @Get("reddit")
    @UseGuards(AuthGuard("reddit"))
    reddit() {
        throw new UnauthorizedException()
    }

    @Get("reddit/callback")
    @UseGuards(AuthGuard("reddit"))
    redditCallback(@Req() req: Request, @Res() res: Response) {
        const jwtToken = req["user"]
        if (jwtToken) {
            res.cookie("jwt", jwtToken, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000
            })
        }
        res.redirect(`${process.env.DASHBOARD_URL}/my-groups`)
    }
}
