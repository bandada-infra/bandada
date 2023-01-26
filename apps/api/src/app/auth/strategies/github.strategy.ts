import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Profile, Strategy } from "passport-github"
import { AuthService } from "../auth.service"

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(this.constructor.name)

    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.NX_API_URL}/auth/github/callback`,
            profileFields: ["id", "email", "read:user", "user:email"]
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
    ) {
        if (profile) {
            const token = await this.authService.findOrCreateAccount({
                service: "github",
                userId: profile.id,
                accessToken,
                refreshToken,
                username: profile.username,
                fullName: profile.displayName,
                avatarURL: profile.photos[0].value
            })

            done(null, token)
        }
    }
}
