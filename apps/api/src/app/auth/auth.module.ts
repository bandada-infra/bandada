import { Global, Module } from "@nestjs/common"
import { AdminsModule } from "../admins/admins.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

@Global()
@Module({
    imports: [AdminsModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
