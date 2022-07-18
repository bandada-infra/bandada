import { Injectable } from "@nestjs/common"
import { MongoRepository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { CreateUserDTO } from "./dto/create-user.dto"
import { UserModel } from "./User.model"
import { UpdateUserDTO } from "./dto/update-user.dto"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModel)
        private userRepository: MongoRepository<UserModel>
    ) {}

    public async create(
        payload: CreateUserDTO
    ): Promise<UserModel & CreateUserDTO> {
        return this.userRepository.save(payload)
    }

    findAll() {
        return this.userRepository.find()
    }

    findOne(id: number) {
        // return this.userRepository.findOne(id)
    }

    update(id: number, payload: UpdateUserDTO) {
        return this.userRepository.update(id, payload)
    }

    remove(id: string) {
        return this.userRepository.delete(id)
    }
}
