import { Injectable } from "@nestjs/common"
import { ObjectID, Repository, UpdateResult } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { CreateAccountDTO } from "./dto/create-account.dto"
import { AccountModel } from "./account.model"
import { UpdateAccountDTO } from "./dto/update-account.dto"

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountModel)
        private accountRepository: Repository<AccountModel>
    ) {}

    public async create(
        payload: CreateAccountDTO
    ): Promise<AccountModel & CreateAccountDTO> {
        return this.accountRepository.save(payload)
    }

    public async findAll(): Promise<AccountModel[]> {
        return await this.accountRepository.find()
    }

    public async findOne(id: ObjectID): Promise<AccountModel> {
        return await this.accountRepository.findOneBy({ id })
    }

    public async update(
        id: ObjectID,
        payload: UpdateAccountDTO
    ): Promise<UpdateResult> {
        return await this.accountRepository.update(id, payload)
    }

    public async remove(id: ObjectID): Promise<void> {
        await this.accountRepository.delete(id)
    }
}
