import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request, Response } from "express"

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
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
        }

        res.redirect(`${process.env.NX_DASHBOARD_URL}/my-groups`)
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
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
        }

        res.redirect(`${process.env.NX_DASHBOARD_URL}/my-groups`)
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
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
        }

        res.redirect(`${process.env.NX_DASHBOARD_URL}/my-groups`)
    }

    @Get("getUser")
    @UseGuards(AuthGuard("jwt"))
    jwtCheck() {
        return true
    }

    @Post("log-out")
    @UseGuards(AuthGuard("jwt"))
    logOut(@Req() req: Request, @Res() res: Response) {
        res.cookie("jwt", "", {
            httpOnly: true,
            maxAge: 0
        })
        res.redirect(`${process.env.NX_DASHBOARD_URL}`)
    }
}
