import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app/app.module"
import cookieParser from "cookie-parser"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    )

    const globalPrefix = "api"
    const port = 3000

    app.setGlobalPrefix(globalPrefix)
    app.use(cookieParser())
    app.enableCors({
        origin: true,
        credentials: true
    })

    await app.listen(port)

    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    )
}

bootstrap()
