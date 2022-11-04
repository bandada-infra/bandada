import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { InvitesModule } from "../invites/invites.module"
import { Group } from "./entities/group.entity"
import { GroupsController } from "./groups.controller"
import { GroupsService } from "./groups.service"

@Module({
    imports: [
        forwardRef(() => InvitesModule),
        TypeOrmModule.forFeature([Group])
    ],
    controllers: [GroupsController],
    providers: [GroupsService],
    exports: [GroupsService]
})
export class GroupsModule {}
