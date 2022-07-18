import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"

@Module({
    imports: [
        AuthModule,
        UserModule,
        TypeOrmModule.forRoot({
            type: "mongodb",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.MONGO_PASSWORD,
            password: process.env.MONGO_USERNAME,
            database: process.env.MONGO_DATABASE,
            ssl: true,

            autoLoadEntities: true,

            // Only enable this option if your application is in development,
            // otherwise use TypeORM migrations to sync entity schemas:
            // https://typeorm.io/#/migrations
            synchronize: true
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
