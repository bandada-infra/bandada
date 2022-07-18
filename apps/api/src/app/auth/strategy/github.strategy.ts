import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-github"
import { Profile } from "../type"

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(this.constructor.name)

    constructor() {
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
        if (profile && profile.emails.length > 0) {
            // @todo create a login request
        }
    }
}
