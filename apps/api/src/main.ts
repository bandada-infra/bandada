/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"

import { AppModule } from "./app/app.module"
import * as session from "express-session"

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule.forRoot({
            type: "mongodb",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.MONGO_PASSWORD,
            password: process.env.MONGO_USERNAME,
            database: process.env.MONGO_DATABASE,
            ssl: process.env.NODE_ENV === "production" ? true : false,
            synchronize: true
        })
    )
    const globalPrefix = "api"
    app.setGlobalPrefix(globalPrefix)
    const port = process.env.PORT || 3333
    app.use(
        session({
            secret: "zk_groups_dev_session", // @todo (Isaac): move this to environment variables.
            resave: false,
            saveUninitialized: false
        })
    )
    await app.listen(port)
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    )
}

bootstrap()
