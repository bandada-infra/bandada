import {
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException
} from "@nestjs/common"
import { SiweMessage } from "siwe"
import { v4 } from "uuid"
import { AdminService } from "../admins/admins.service"
import { SignInWithEthereumDTO } from "./dto/siwe.dto"

@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService) {}

    async signIn(
        { message, signature }: SignInWithEthereumDTO,
        expectedNonce: string
    ) {
        const siweMessage = new SiweMessage(message)
        const { address, statement, domain, nonce } =
            await siweMessage.validate(signature)

        if (nonce !== expectedNonce) {
            throw new UnprocessableEntityException("Invalid nonce.")
        }

        if (statement !== process.env.SIWE_STATEMENT) {
            throw new UnauthorizedException(
                "Invalid statement used in the SIWE message."
            )
        }

        // Assuming the auth was made from the dashboard
        if (domain !== new URL(process.env.DASHBOARD_URL).host) {
            throw new UnauthorizedException(
                "Invalid domain used in the SIWE message."
            )
        }

        let admin = await this.adminService.findOne({ address })

        if (!admin) {
            admin = await this.adminService.create({
                id: v4(),
                address
            })
        }

        return { admin, siweMessage }
    }

    async isLoggedIn(adminId: string): Promise<boolean> {
        return !!(await this.adminService.findOne({ id: adminId }))
    }
}
