import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AccountModel } from "../account/account.model"
import { AccountService } from "../account/account.service"
import { CreateAccountDTO } from "../account/dto/create-account.dto"

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) {}
    public async findOrCreateAccount(
        payload: CreateAccountDTO
    ): Promise<string> {
        let user: AccountModel = await this.accountService.findOne({
            username: payload.username,
            service: payload.service
        })

        if (!user) {
            user = await this.accountService.create(payload)
        }
        return this.generateToken(user)
    }

    public async generateToken(payload: AccountModel): Promise<string> {
        return await this.jwtService.sign({
            id: payload.id,
            username: payload.username
        })
    }
}
