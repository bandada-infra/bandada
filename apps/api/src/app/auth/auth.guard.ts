/* istanbul ignore file */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common"
import { AdminsService } from "../admins/admins.service"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private adminsService: AdminsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()

        const { adminId } = req.session

        if (!adminId) {
            throw new UnauthorizedException()
        }

        try {
            const admin = await this.adminsService.findOne({ id: adminId })

            req["admin"] = admin
        } catch {
            throw new UnauthorizedException()
        }

        return true
    }
}
