import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupData } from "./entities/group.entity"
import { GroupsController } from "./groups.controller"
import { GroupsService } from "./groups.service"

@Module({
    imports: [TypeOrmModule.forFeature([GroupData])],
    controllers: [GroupsController],
    providers: [GroupsService],
    exports: [GroupsService]
})
export class GroupsModule {}
