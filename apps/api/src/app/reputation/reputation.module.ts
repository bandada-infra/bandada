import { forwardRef, Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupsModule } from "../groups/groups.module"
import { ReputationAccount } from "./entities/reputation-account.entity"
import { ReputationController } from "./reputation.controller"
import { ReputationService } from "./reputation.service"

@Module({
    imports: [
        ScheduleModule.forRoot(),
        forwardRef(() => GroupsModule),
        TypeOrmModule.forFeature([ReputationAccount])
    ],
    controllers: [ReputationController],
    providers: [ReputationService],
    exports: [ReputationService]
})
export class ReputationModule {}
