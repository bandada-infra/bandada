/* istanbul ignore file */
import { id } from "@ethersproject/hash"
import { BadRequestException, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"
import { v4 } from "uuid"
import { ApiKeyActions } from "@bandada/utils"
import { CreateAdminDTO } from "./dto/create-admin.dto"
import { Admin } from "./entities/admin.entity"

@Injectable()
export class AdminsService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>
    ) {}

    public async create(payload: CreateAdminDTO): Promise<Admin> {
        const username = payload.username || payload.address.slice(-5)

        const admin = {
            id: id(payload.id),
            address: payload.address,
            username,
            createdAt: new Date()
        }

        Logger.log(`AdminsService: admin '${admin.id}' has been created`)

        return this.adminRepository.save(admin)
    }

    public async findOne(
        payload: FindOptionsWhere<Admin> | FindOptionsWhere<Admin>[]
    ): Promise<Admin> {
        return this.adminRepository.findOneBy(payload)
    }

    /**
     * Updates the API key for a given admin based on the specified actions.
     *
     * @param adminId The identifier of the admin.
     * @param action The action to be executed on the API key of the admin.
     * @returns {Promise<string>} The API key of the admin after the update operation. If the API key is disabled, the return value might not be meaningful.
     * @throws {BadRequestException} If the admin ID does not correspond to an existing admin, if the admin does not have an API key when trying to enable it, or if the action is unsupported.
     */
    async updateApiKey(
        adminId: string,
        action: ApiKeyActions
    ): Promise<string> {
        const admin = await this.findOne({
            id: adminId
        })

        if (!admin) {
            throw new BadRequestException(
                `The '${adminId}' does not belong to an admin`
            )
        }

        switch (action) {
            case ApiKeyActions.Generate:
                admin.apiKey = v4()
                admin.apiEnabled = true
                break
            case ApiKeyActions.Enable:
                if (!admin.apiKey)
                    throw new BadRequestException(
                        `The '${adminId}' does not have an apikey`
                    )
                admin.apiEnabled = true
                break
            case ApiKeyActions.Disable:
                admin.apiEnabled = false
                break
            default:
                throw new BadRequestException(`Unsupported ${action} apikey`)
        }

        await this.adminRepository.save(admin)

        Logger.log(
            `AdminsService: admin '${admin.id}' api key have been updated`
        )

        return admin.apiKey
    }
}
