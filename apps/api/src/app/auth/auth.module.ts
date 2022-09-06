import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AccountModule } from "../accounts/account.module"
import { CookieSerializer } from "../common/cookie.serializer"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { GithubStrategy } from "./strategies/github.strategy"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { RedditStrategy } from "./strategies/reddit.strategy"
import { TwitterStrategy } from "./strategies/twitter.strategy"

@Module({
    imports: [
        AccountModule,
        PassportModule.register({ session: true }),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: "60s" }
        })
    ],
    providers: [
        GithubStrategy,
        TwitterStrategy,
        RedditStrategy,
        AuthService,
        CookieSerializer,
        JwtStrategy
    ],
    controllers: [AuthController],
    exports: [PassportModule, JwtModule]
})
export class AuthModule {}
