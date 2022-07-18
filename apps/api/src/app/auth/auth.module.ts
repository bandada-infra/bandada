import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./auth.controller"
import * as passport from "passport"
import { GithubStrategy } from "./strategy"
import { AuthService } from "./auth.service"
import { AccountService } from "../user/account.service"
import { AccountModule } from "../user/account.module"

@Module({
    imports: [AccountModule, PassportModule.register({ session: true })],
    providers: [GithubStrategy, AuthService, AccountService],
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

                    loginOption.state = state
                    next()
                },
                passport.authenticate("github", loginOption),
                (_, res) => {
                    res.redirect("/")
                }
            )
            .forRoutes("api/auth/github/callback")
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
            .forRoutes("api/auth/twitter/callback")
    }
}
