import { Injectable, ExecutionContext } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class GitHubOAuthGuard extends AuthGuard("github") {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean
        const request = context.switchToHttp().getRequest()
        await super.logIn(request)
        return activate
    }
}
