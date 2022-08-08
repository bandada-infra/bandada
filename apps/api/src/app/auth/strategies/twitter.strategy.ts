import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, VerifyCallback } from "passport-twitter"
import { AuthService } from "../auth.service"

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, "twitter") {
    logger = new Logger(this.constructor.name)

    constructor(private readonly authService: AuthService) {
        super({
            consumerKey: process.env.TWITTER_CLIENT_ID,
            consumerSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/auth/twitter/callback`,
            userProfileURL:
                "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
            passReqToCallback: true
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
                service: "twitter",
                tokens: {
                    accessToken,
                    userId: profile.id
                },
                email: profile.emails[0].value,
                username: profile.username,
                fullName: profile.displayName,
                avatarURL: profile.photos[0].value
            }
            const token: string = await this.authService.findOrCreateAccount(
                payload
            )

            // @todo generate jwt token here
            done(null, token)
        }
    }
}
