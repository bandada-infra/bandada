import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupsModule } from "../groups/groups.module"
import { Invite } from "./entities/invite.entity"
import { InvitesController } from "./invites.controller"
import { InvitesService } from "./invites.service"

@Module({
    imports: [GroupsModule, TypeOrmModule.forFeature([Invite])],
    controllers: [InvitesController],
    providers: [InvitesService]
})
export class InvitesModule {}
