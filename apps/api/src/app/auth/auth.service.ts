/* istanbul ignore file */
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { SiweMessage } from "siwe"
import { v4 } from "uuid"
import { UserService } from "../users/users.service"
import { SignInWithEthereumDTO } from "./dto/siwe-dto"

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async signIn(params: SignInWithEthereumDTO) {
        const { message, signature } = params

        const siweMessage = new SiweMessage(message)
        const { address, statement, domain } = await siweMessage.validate(
            signature
        )

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

        let user = await this.userService.findOne({ address })

        if (!user) {
            user = await this.userService.create({
                id: v4(),
                address
            })
        }

        // TODO: Use common expiration
        const token = this.jwtService.sign({
            id: user.id,
            username: user.username
        })

        return { token, user }
    }
}
