import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModel } from "./user.model"
import { UserService } from "./user.service"

@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    exports: [TypeOrmModule],
    providers: [UserService],
    controllers: []
})
export class UserModule {}
