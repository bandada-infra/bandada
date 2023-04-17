import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "../users/users.service"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { token } = request.cookies
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET_KEY
            })

            const user = await this.userService.findOne({ id: payload.id })

            request["user"] = user
        } catch {
            throw new UnauthorizedException()
        }

        return true
    }
}
