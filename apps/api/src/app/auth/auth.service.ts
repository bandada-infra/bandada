import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AccountModel } from "../accounts/account.model"
import { AccountService } from "../accounts/account.service"
import { CreateAccountDTO } from "../accounts/dto/create-account.dto"
import { Payload } from "./types"

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) {}

    public async findOrCreateAccount(
        payload: CreateAccountDTO
    ): Promise<string> {
        let account: AccountModel = await this.accountService.findOne({
            username: payload.username,
            service: payload.service
        })

        if (!account) {
            account = await this.accountService.create(payload)
        }

        return this.generateToken(account)
    }

    public async generateToken(payload: AccountModel): Promise<string> {
        return this.jwtService.sign({
            userId: payload.userId,
            username: payload.username
        })
    }

    async tokenValidateAccount(
        payload: Payload
    ): Promise<AccountModel | undefined> {
        const userFind = await this.accountService.findOne({
            userId: payload.userId,
            username: payload.username
        })

        return userFind
    }
}
