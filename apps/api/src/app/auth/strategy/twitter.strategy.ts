import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-twitter"
import { AccountService } from "../../account/account.service"

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(this.constructor.name)

    constructor(private readonly accountService: AccountService) {
        super({
            clientID: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/auth/twitter`,
            profileFields: ["id", "email", "read:user", "user:email"]
        })
    }

    async validate(accessToken: string, refreshToken: string, profile) {
        if (profile) {
            const payload = {
                service: "twitter",
                tokens: {
                    accessToken,
                    userId: profile.id
                },
                username: profile.username,
                fullName: profile.displayName,
                avatarURL: profile.photos[0].value
            }

            const user = await this.accountService.create(payload)

            return user.id
        }
    }
}
