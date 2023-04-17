/* istanbul ignore file */
import { id } from "@ethersproject/hash"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"
import { CreateAccountDTO } from "./dto/create-account.dto"
import { Account } from "./entities/account.entity"

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ) {}

    public async create(
        payload: CreateAccountDTO
    ): Promise<CreateAccountDTO> {
        const username = payload.username || payload.id.slice(-5)

        return this.accountRepository.save({
            id: id(payload.id),
            username,
            createdAt: new Date(),
        })
    }

    public async findOne(
        payload: FindOptionsWhere<Account> | FindOptionsWhere<Account>[]
    ): Promise<Account> {
        return this.accountRepository.findOneBy(payload)
    }
}
