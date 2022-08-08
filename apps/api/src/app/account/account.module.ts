import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountModel } from "./account.model"
import { AccountService } from "./account.service"

@Module({
    imports: [TypeOrmModule.forFeature([AccountModel])],
    exports: [AccountService],
    providers: [AccountService],
    controllers: []
})
export class AccountModule {}
