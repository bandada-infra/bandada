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
    ): Promise<Account & CreateAccountDTO> {
        payload.userId = BigInt(id(payload.userId)).toString()

        return this.accountRepository.save(payload)
    }

    public async findOne(
        payload: FindOptionsWhere<Account> | FindOptionsWhere<Account>[]
    ): Promise<Account> {
        return this.accountRepository.findOneBy(payload)
    }

    //public async findAll(): Promise<Account[]> {
    //return this.accountRepository.find()
    //}

    //public async update(
    //id: number,
    //payload: UpdateAccountDTO
    //): Promise<UpdateResult> {
    //return this.accountRepository.update(id, payload)
    //}

    //public async remove(id: number): Promise<DeleteResult> {
    //return this.accountRepository.delete(id)
    //}
}
