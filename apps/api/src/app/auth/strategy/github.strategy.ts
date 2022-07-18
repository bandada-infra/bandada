import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-github"
import { AccountService } from "../../user/account.service"
import { Profile } from "../type"

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(this.constructor.name)

    constructor(private readonly accountService: AccountService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.BASE_URL,
            profileFields: ["id", "email", "read:user", "user:email"]
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile
    ) {
        console.log(accessToken, refreshToken, profile)
        if (profile && profile.emails.length > 0) {
            const payload = {
                service: "GITHUB",
                tokens: {
                    accessToken,
                    userId: profile.id
                },
                email: profile?.emails[0]?.value,
                // firstname: names[0],
                // lastname: names[1],
                password: undefined
                // username: profile.username
            }
        }
    }
}
