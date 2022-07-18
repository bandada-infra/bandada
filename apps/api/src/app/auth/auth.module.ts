import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./auth.controller"
import * as passport from "passport"
import { GithubStrategy } from "./strategy"
import { AuthService } from "./auth.service"
import { UserService } from "../user/user.service"
import { UserModule } from "../user/user.module"

@Module({
    imports: [UserModule, PassportModule.register({ session: true })],
    providers: [GithubStrategy, AuthService, UserService],
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
