import { Injectable } from "@nestjs/common"
// import { CreateUserDTO } from "../user/dto/create-user.dto"
import { UserService } from "../user/user.service"

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    // public async registerUser(payload: CreateUserDTO) {}
}
