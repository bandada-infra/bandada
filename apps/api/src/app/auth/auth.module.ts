import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { UsersModule } from "../users/users.module"
import { CookieSerializer } from "../utils"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: "300s" }
        })
    ],
    providers: [AuthService, CookieSerializer],
    controllers: [AuthController],
    exports: [JwtModule]
})
export class AuthModule {}
