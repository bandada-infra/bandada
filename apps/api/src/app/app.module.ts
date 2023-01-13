import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import "pg" // This is required for NX to include pg in api package.json during build
import { AccountModule } from "./accounts/account.module"
import { AuthModule } from "./auth/auth.module"
import { GroupsModule } from "./groups/groups.module"
import { InvitesModule } from "./invites/invites.module"

type DB_TYPE = 'mysql' | 'sqlite' | 'postgres';

@Module({
    imports: [
        AuthModule,
        AccountModule,
        InvitesModule,
        GroupsModule,
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as DB_TYPE || 'postgres',
            url: process.env.DB_URL,
            ...process.env.DB_TYPE === 'sqlite' && { database: process.env.DB_URL },
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV === "production" ? false : true
        })
    ]
})

export class AppModule {}
