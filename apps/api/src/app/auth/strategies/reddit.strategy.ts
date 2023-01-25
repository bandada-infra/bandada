import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Profile, Strategy } from "@zk-groups/passport-reddit"
import { AuthService } from "../auth.service"

@Injectable()
export class RedditStrategy extends PassportStrategy(Strategy, "reddit") {
    logger = new Logger(this.constructor.name)

    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            callbackURL: `${process.env.NX_API_URL}/auth/reddit/callback`
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
                service: "reddit",
                userId: profile.id,
                accessToken,
                refreshToken,
                username: profile.name,
                fullName: profile.subreddit.title,
                avatarURL: profile.icon_img
            })

            done(null, token)
        }
    }
}
