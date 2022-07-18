import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-github"
import { AccountService } from "../../account/account.service"

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(this.constructor.name)

    constructor(private readonly accountService: AccountService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/auth/github`,
            profileFields: ["id", "email", "read:user", "user:email"]
        })
    }

    async validate(accessToken: string, refreshToken: string, profile) {
        if (profile) {
            const payload = {
                service: "github",
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
