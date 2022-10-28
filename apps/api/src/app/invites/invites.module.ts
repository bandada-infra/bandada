import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupsModule } from "../groups/groups.module"
import { Invite } from "./entities/invite.entity"
import { InvitesController } from "./invites.controller"
import { InvitesService } from "./invites.service"

@Module({
    imports: [
        forwardRef(() => GroupsModule),
        TypeOrmModule.forFeature([Invite])
    ],
    controllers: [InvitesController],
    providers: [InvitesService],
    exports: [InvitesService]
})
export class InvitesModule {}
