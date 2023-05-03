import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { ironSession } from "iron-session/express"
import { AppModule } from "./app/app.module"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    )

    const port = 3000

    app.use(
        ironSession({
            cookieName: "bandada_siwe_cookie",
            password: process.env.IRON_SESSION_PASSWORD,
            cookieOptions: {
                // TODO: decide when session should expiry.
                // expires: ,
                secure: process.env.NODE_ENV === "production"
            }
        })
    )

    app.enableCors({
        origin: true,
        credentials: true
    })

    await app.listen(port)

    Logger.log(`🚀 Application is running on: http://localhost:${port}`)
}

bootstrap()
