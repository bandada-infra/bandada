import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./auth.controller"
import { GithubStrategy, TwitterStrategy } from "./strategies"
import { AuthService } from "./auth.service"
import { AccountService } from "../account/account.service"
import { AccountModule } from "../account/account.module"
import { CookieSerializer } from "../common/cookie.serializer"
import { JwtModule } from "@nestjs/jwt"

@Module({
    imports: [
        AccountModule,
        PassportModule.register({ session: true }),
        JwtModule.register({
            secret: "zk_groups_jwt_secret",
            signOptions: { expiresIn: "60s" }
        })
    ],
    providers: [
        GithubStrategy,
        TwitterStrategy,
        AuthService,
        AccountService,
        CookieSerializer
    ],
    controllers: [AuthController],
    exports: [PassportModule, JwtModule]
})
export class AuthModule {}
