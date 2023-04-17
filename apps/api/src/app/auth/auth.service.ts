/* istanbul ignore file */
import { Injectable } from "@nestjs/common"
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
        const { address } = await siweMessage.validate(signature)

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
            username: user.username,
        })

        return { token, user }
    }
}
