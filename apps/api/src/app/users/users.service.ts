/* istanbul ignore file */
import { id } from "@ethersproject/hash"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"
import { CreateUserDTO } from "./dto/create-user.dto"
import { User } from "./entities/user.entity"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    public async create(
        payload: CreateUserDTO
    ): Promise<User> {
        const username = payload.username || payload.address.slice(-5)

        return this.userRepository.save({
            id: id(payload.id),
            address: payload.address,
            username,
            createdAt: new Date(),
        })
    }

    public async findOne(
        payload: FindOptionsWhere<User> | FindOptionsWhere<User>[]
    ): Promise<User> {
        return this.userRepository.findOneBy(payload)
    }
}
