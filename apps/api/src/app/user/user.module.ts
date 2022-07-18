import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModel } from "./User.model"
import { UserService } from "./user.service"

@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    providers: [UserService],
    controllers: []
})
export class UserModule {}
