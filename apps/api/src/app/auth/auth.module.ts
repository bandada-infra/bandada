import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./auth.controller"
import * as passport from "passport"
import { GithubStrategy } from "./strategy"
import { AuthService } from "./auth.service"
import { AccountService } from "../account/account.service"
import { AccountModule } from "../account/account.module"
import { CookieSerializer } from "../common/cookie.serializer"

@Module({
    imports: [AccountModule, PassportModule.register({ session: true })],
    providers: [GithubStrategy, AuthService, AccountService, CookieSerializer],
    controllers: [AuthController]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const loginOption = {
            session: true,
            state: null
        }
        consumer
            .apply(
                (req, _, next: () => void) => {
                    const {
                        query: { state }
                    } = req

                    console.log(state)

                    loginOption.state = state
                    next()
                },
                passport.authenticate("github", loginOption),
                (_, res) => {
                    res.redirect("/")
                }
            )
            .forRoutes("auth/github/callback")
        consumer
            .apply(
                (req, _, next: () => void) => {
                    const {
                        query: { state }
                    } = req

                    loginOption.state = state
                    next()
                },
                passport.authenticate("twitter", loginOption),
                (_, res) => {
                    res.redirect("/")
                }
            )
            .forRoutes("auth/twitter/callback")
    }
}
