import { forwardRef, Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { TypeOrmModule } from "@nestjs/typeorm"
import { InvitesModule } from "../invites/invites.module"
import { Group } from "./entities/group.entity"
import { Member } from "./entities/member.entity"
import { GroupsController } from "./groups.controller"
import { GroupsService } from "./groups.service"
import { AdminsModule } from "../admins/admins.module"
import { Admin } from "../admins/entities/admin.entity"
import { AdminsService } from "../admins/admins.service"

@Module({
    imports: [
        ScheduleModule.forRoot(),
        forwardRef(() => InvitesModule),
        TypeOrmModule.forFeature([Member, Group, Admin]),
        AdminsModule
    ],
    controllers: [GroupsController],
    providers: [GroupsService, AdminsService],
    exports: [GroupsService]
})
export class GroupsModule {}
