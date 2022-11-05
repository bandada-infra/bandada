import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Account } from "../accounts/entities/account.entity"
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
        let account: Account = await this.accountService.findOne({
            username: payload.username,
            service: payload.service
        })

        if (!account) {
            account = await this.accountService.create(payload)
        }

        return this.generateToken(account)
    }

    public async generateToken(payload: Account): Promise<string> {
        return this.jwtService.sign({
            userId: payload.userId,
            username: payload.username
        })
    }

    async tokenValidateAccount(payload: Payload): Promise<Account | undefined> {
        const userFind = await this.accountService.findOne({
            userId: payload.userId,
            username: payload.username
        })

        return userFind
    }
}
