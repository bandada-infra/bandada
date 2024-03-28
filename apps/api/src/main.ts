import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ironSession } from "iron-session/express"
import { AppModule } from "./app/app.module"
import { GroupsService } from "./app/groups/groups.service"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const groupService = app.get(GroupsService)
    await groupService.initialize()

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
            "https://api.github.com/repos/bandada-infra/bandada/releases/latest"
        )
    ).json()

    const config = new DocumentBuilder()
        .setTitle("Bandada API Docs")
        .setDescription("A system for managing privacy-preserving groups.")
        .setVersion(latestVersion["name"])
        .build()

    const document = SwaggerModule.createDocument(app, config)

    const configUI = {
        swaggerOptions: { defaultModelsExpandDepth: -1 },
        customfavIcon:
            "https://raw.githubusercontent.com/bandada-infra/bandada/main/apps/dashboard/src/assets/favicon.ico",
        customSiteTitle: "Bandada API Docs",
        customCss: `.topbar-wrapper img {content:url('https://raw.githubusercontent.com/bandada-infra/bandada/d5268274cbb93f73a1960e131bff0d2bf1eacea9/apps/dashboard/src/assets/icon1.svg'); width:60px; height:auto;}
        .swagger-ui .topbar { background-color: transparent; } small.version-stamp { display: none !important; }`,
        customJsStr: `
    // Add a custom title to the right side of the Swagger UI page
    document.addEventListener('DOMContentLoaded', function() {
        const customTitle = document.createElement('div');
        customTitle.style.position = 'absolute';
        customTitle.style.top = '27px';
        customTitle.style.padding = '10px';
        customTitle.style.color = 'black';
        customTitle.style.fontSize = '18px';
        customTitle.style.padding = '0 20px';
        customTitle.style.maxWidth = '1460px';
        customTitle.style.display = 'flex';
        customTitle.style.justifyContent = 'end';
        customTitle.style.width = '100%';


        // Create a hyperlink element
        const link = document.createElement('a');
        link.href = 'https://github.com/bandada-infra/bandada';
        link.rel = 'noreferrer noopener nofollow';
        link.target = '_blank'
        link.style.color = 'grey';
        link.style.display = 'flex';

        // Create a text node for the link text
        const linkText = document.createTextNode('Github');

        // Append the text node to the link
        link.appendChild(linkText);

        // Create an SVG element for the GitHub icon
        const githubIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        githubIcon.setAttribute('width', '24');
        githubIcon.setAttribute('height', '24');
        githubIcon.setAttribute('viewBox', '0 0 20 20');
        githubIcon.setAttribute('fill', 'currentColor');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M8 .153C3.589.153 0 3.742 0 8.153c0 3.436 2.223 6.358 5.307 7.408.387.071.53-.168.53-.374 0-.185-.007-.674-.01-1.322-2.039.445-2.47-.979-2.47-.979-.334-.849-.815-1.075-.815-1.075-.667-.457.05-.448.05-.448.739.052 1.13.76 1.13.76.656 1.124 1.719.799 2.134.61.067-.478.256-.8.466-.98-1.63-.184-3.34-.815-3.34-3.627 0-.8.287-1.457.754-1.969-.076-.185-.327-.932.072-1.943 0 0 .618-.198 2.03.752a6.74 6.74 0 0 1 1.8-.245c.61.003 1.226.082 1.8.245 1.41-.95 2.027-.752 2.027-.752.4 1.011.148 1.758.073 1.943.47.512.754 1.17.754 1.969 0 2.82-1.712 3.44-3.35 3.623.264.227.497.672.497 1.356 0 .977-.009 1.764-.009 2.004 0 .207.141.449.544.373C13.775 14.511 16 11.59 16 8.154 16 3.743 12.411 .154 8 .154z');

        // Append the path to the GitHub icon
        githubIcon.appendChild(path);

        // Append the GitHub icon to the link
        link.insertBefore(githubIcon, link.firstChild);

        // Apply some padding to create space between the icon and the text
        link.style.paddingLeft = '8px';

        // Append the link to the custom title
        customTitle.appendChild(link);

        const parentDiv = document.createElement('div');
        parentDiv.style.display = 'flex';
        parentDiv.style.justifyContent = 'center';
        parentDiv.style.width = 'auto';


        parentDiv.appendChild(customTitle)

        document.body.appendChild(parentDiv);
    });
`
    }

    SwaggerModule.setup("/", app, document, configUI)

    await app.listen(port)

    Logger.log(`🚀 Application is running on: http://localhost:${port}`)
}

bootstrap()
