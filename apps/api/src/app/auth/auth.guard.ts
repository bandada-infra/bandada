import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common"
import { AdminService } from "../admins/admins.service"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private adminService: AdminService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()

        const { adminId } = req.session

        if (!adminId) {
            throw new UnauthorizedException()
        }

        try {
            const admin = await this.adminService.findOne({ id: adminId })

            req["admin"] = admin
        } catch {
            throw new UnauthorizedException()
        }

        return true
    }
}
