import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
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
            ttl: 1209600, // Expiry: 14 days.
            cookieName: "bandada_siwe_cookie",
            password: process.env.IRON_SESSION_PASSWORD,
            cookieOptions: {
                secure: process.env.NODE_ENV === "production"
            }
        })
    )

    app.enableCors({
        origin: true,
        credentials: true
    })

    const latestVersion = await (
        await fetch(
            "https://api.github.com/repos/privacy-scaling-explorations/bandada/releases/latest"
        )
    ).json()

    const config = new DocumentBuilder()
        .setTitle("Bandada API Docs")
        .setDescription("A system for managing privacy-preserving groups.")
        .setVersion(latestVersion["name"])
        .build()

    const document = SwaggerModule.createDocument(app, config)

    const configUI = {
        customfavIcon:
            "https://raw.githubusercontent.com/privacy-scaling-explorations/bandada/main/apps/dashboard/src/assets/favicon.ico",
        customSiteTitle: "Bandada API Docs",
        customCss: `.topbar-wrapper img {content:url('https://raw.githubusercontent.com/privacy-scaling-explorations/bandada/d5268274cbb93f73a1960e131bff0d2bf1eacea9/apps/dashboard/src/assets/icon1.svg'); width:60px; height:auto;}
        .swagger-ui .topbar { background-color: transparent; } small.version-stamp { display: none !important; }`
    }

    SwaggerModule.setup("/", app, document, configUI)

    await app.listen(port)

    Logger.log(`🚀 Application is running on: http://localhost:${port}`)
}

bootstrap()
