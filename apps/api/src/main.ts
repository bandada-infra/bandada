import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app/app.module"
import session from "express-session"
import createMemoryStore from "memorystore"
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
    const MemoryStore = createMemoryStore(session)

    app.setGlobalPrefix(globalPrefix)
    app.use(cookieParser())
    app.use(
        process.env.NODE_ENV === "production"
            ? session({
                  cookie: { maxAge: 86400000 },
                  store: new MemoryStore({
                      checkPeriod: 86400000 // Prune expired entries every 24h.
                  }),
                  resave: false,
                  secret: process.env.SESSION_SECRET
              })
            : session({
                  resave: false,
                  secret: "hello world",
                  saveUninitialized: false
              })
    )
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
