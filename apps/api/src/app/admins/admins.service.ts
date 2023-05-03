/* istanbul ignore file */
import { id } from "@ethersproject/hash"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"
import { CreateAdminDTO } from "./dto/create-admin.dto"
import { Admin } from "./entities/admin.entity"

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>
    ) {}

    public async create(payload: CreateAdminDTO): Promise<Admin> {
        const username = payload.username || payload.address.slice(-5)

        return this.adminRepository.save({
            id: id(payload.id),
            address: payload.address,
            username,
            createdAt: new Date()
        })
    }

    public async findOne(
        payload: FindOptionsWhere<Admin> | FindOptionsWhere<Admin>[]
    ): Promise<Admin> {
        return this.adminRepository.findOneBy(payload)
    }
}
