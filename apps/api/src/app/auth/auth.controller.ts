import { Controller, Get, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import * as passport from "passport"

@Controller("auth")
export class AuthController {
    @UseGuards(AuthGuard("github"))
    @Get("/github")
    githubAuthentication() {
        passport.authenticate("github")
    }

    @UseGuards(AuthGuard("twitter"))
    @Get("/twitter")
    twitterAuthentication() {
        passport.authenticate("github")
    }
}
