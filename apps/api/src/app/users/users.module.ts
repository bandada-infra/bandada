import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { UserService } from "./users.service"

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
    providers: [UserService],
    controllers: []
})
export class UsersModule {}
