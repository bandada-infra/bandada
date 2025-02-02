/* eslint-disable import/first */
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"

dotenvConfig({ path: resolve(process.cwd(), ".env") })

import { Module } from "@nestjs/common"
import { ThrottlerModule } from "@nestjs/throttler"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AdminsModule } from "./admins/admins.module"
import { AuthModule } from "./auth/auth.module"
import { GroupsModule } from "./groups/groups.module"
import { InvitesModule } from "./invites/invites.module"
import { CredentialsModule } from "./credentials/credentials.module"

type DB_TYPE = "mysql" | "sqlite" | "postgres"

const TYPEORM_OPTIONS = {
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== "production",
    type: (process.env.DB_TYPE as DB_TYPE) || "postgres",
    url: process.env.DB_URL,
    ...(process.env.DB_TYPE === "sqlite" && { database: process.env.DB_URL })
}
const schema = process.env.DB_SCHEMA?.trim() || ""
const typeOrmOptions =
    schema === "" ? TYPEORM_OPTIONS : { ...TYPEORM_OPTIONS, schema }

@Module({
    imports: [
        AuthModule,
        AdminsModule,
        InvitesModule,
        GroupsModule,
        CredentialsModule,
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10
        }),
        TypeOrmModule.forRoot(typeOrmOptions)
    ]
})
export class AppModule {}
