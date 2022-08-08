import { Injectable, ExecutionContext } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class TwitterOAuthGuard extends AuthGuard("twitter") {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean
        await super.logIn(context.switchToHttp().getRequest())

        return result
    }
}
