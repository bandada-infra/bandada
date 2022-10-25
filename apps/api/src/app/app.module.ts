import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountModule } from "./accounts/account.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { GroupsModule } from "./groups/groups.module"

@Module({
    imports: [
        AuthModule,
        AccountModule,
        GroupsModule,
        TypeOrmModule.forRoot({
            type: "mongodb",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            // authSource: "admin",
            ssl: process.env.NODE_ENV === "production" ? true : false,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV === "production" ? false : true
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
