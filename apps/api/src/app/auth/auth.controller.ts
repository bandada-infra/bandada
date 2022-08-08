import { Controller, Get, Res, UseGuards } from "@nestjs/common"
import * as passport from "passport"
import { GitHubOAuthGuard } from "./guards/github.guard"
import { TwitterOAuthGuard } from "./guards/twitter.guard"

@Controller("auth")
export class AuthController {
    @UseGuards(GitHubOAuthGuard)
    @Get("/github")
    githubOAuth() {
        passport.authenticate("github")
    }

    @UseGuards(GitHubOAuthGuard)
    @Get("/github/callback")
    githubOAuthRedirect(_, @Res() res) {
        res.redirect(`${process.env.BASE_URL}/api`)
    }

    @UseGuards(TwitterOAuthGuard)
    @Get("/twitter")
    twitterOAuth() {
        passport.authenticate("twitter")
    }

    @UseGuards(TwitterOAuthGuard)
    @Get("/twitter/callback")
    twitterOAuthRedirect(_, @Res() res) {
        res.redirect(`${process.env.BASE_URL}/api`)
    }
}
