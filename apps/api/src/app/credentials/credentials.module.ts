import { forwardRef, Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupsModule } from "../groups/groups.module"
import { OAuthAccount } from "./entities/credentials-account.entity"
import { CredentialsController } from "./credentials.controller"
import { CredentialsService } from "./credentials.service"

@Module({
    imports: [
        ScheduleModule.forRoot(),
        forwardRef(() => GroupsModule),
        TypeOrmModule.forFeature([OAuthAccount])
    ],
    controllers: [CredentialsController],
    providers: [CredentialsService],
    exports: [CredentialsService]
})
export class CredentialsModule {}
