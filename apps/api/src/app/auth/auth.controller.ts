import {
    Controller,
    Get,
    Res,
    UnauthorizedException,
    UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Response, Request } from "express"

const REDIRECT_URL = "http://localhost:4200/my-groups"

@Controller("auth")
export class AuthController {
    @Get("github")
    @UseGuards(AuthGuard("github"))
    github() {
        throw new UnauthorizedException()
    }

    @Get("github/callback")
    @UseGuards(AuthGuard("github"))
    githubCallback(_: Request, @Res() response: Response) {
        response.redirect(REDIRECT_URL)
    }

    @Get("twitter")
    @UseGuards(AuthGuard("twitter"))
    twitter() {
        throw new UnauthorizedException()
    }

    @Get("twitter/callback")
    @UseGuards(AuthGuard("twitter"))
    twitterCallback(_: Request, @Res() response: Response) {
        response.redirect(REDIRECT_URL)
    }

    @Get("reddit")
    @UseGuards(AuthGuard("reddit"))
    reddit() {
        throw new UnauthorizedException()
    }

    @Get("reddit/callback")
    @UseGuards(AuthGuard("reddit"))
    redditCallback(_: Request, @Res() response: Response) {
        response.redirect(REDIRECT_URL)
    }
}
