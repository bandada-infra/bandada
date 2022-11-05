import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountModule } from "./accounts/account.module"
import { AuthModule } from "./auth/auth.module"
import { GroupsModule } from "./groups/groups.module"
import { InvitesModule } from "./invites/invites.module"

@Module({
    imports: [
        AuthModule,
        AccountModule,
        InvitesModule,
        GroupsModule,
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV === "production" ? false : true
        })
    ]
})
export class AppModule {}
