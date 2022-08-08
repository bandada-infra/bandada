import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, VerifyCallback } from "passport-github"
import { AccountModel } from "../../account/account.model"
import { AuthService } from "../auth.service"

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(this.constructor.name)

    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
            profileFields: ["id", "email", "read:user", "user:email"]
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile,
        done: VerifyCallback
    ) {
        if (profile) {
            const payload = {
                service: "github",
                tokens: {
                    accessToken,
                    userId: profile.id
                },
                email: profile._json.email,
                username: profile.username,
                fullName: profile.displayName,
                avatarURL: profile.photos[0].value
            }
            const token: string = await this.authService.findOrCreateAccount(
                payload
            )

            console.log(token)

            done(null, token)
        }
    }
}
