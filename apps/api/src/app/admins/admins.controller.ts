import { Body, Controller, Post, Put } from "@nestjs/common"
import { CreateAdminDTO } from "./dto/create-admin.dto"
import { UpdateApiKeyDTO } from "./dto/update-apikey.dto"
import { AdminsService } from "./admins.service"
import { Admin } from "./entities/admin.entity"

@Controller("admins")
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Post()
    async createAdmin(@Body() dto: CreateAdminDTO): Promise<Admin> {
        return this.adminsService.create(dto)
    }

    @Put("update-apikey")
    async updateApiKey(@Body() dto: UpdateApiKeyDTO): Promise<string> {
        return this.adminsService.updateApiKey({
            adminId: dto.adminId,
            action: dto.action
        })
    }
}
