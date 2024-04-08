import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupsModule } from "../groups/groups.module"
import { Invite } from "./entities/invite.entity"
import { InvitesController } from "./invites.controller"
import { InvitesService } from "./invites.service"
import { AdminsModule } from "../admins/admins.module"
import { AdminsService } from "../admins/admins.service"
import { Admin } from "../admins/entities/admin.entity"

@Module({
    imports: [
        forwardRef(() => GroupsModule),
        TypeOrmModule.forFeature([Invite, Admin]),
        AdminsModule
    ],
    controllers: [InvitesController],
    providers: [InvitesService, AdminsService],
    exports: [InvitesService]
})
export class InvitesModule {}
