import { Injectable } from "@nestjs/common"
// import { CreateUserDTO } from "../user/dto/create-user.dto"
import { AccountService } from "../user/account.service"

@Injectable()
export class AuthService {
    constructor(private readonly accountService: AccountService) {}
    // public async registerUser(payload: CreateUserDTO) {}
}
