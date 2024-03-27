import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common"
import { ApiCreatedResponse } from "@nestjs/swagger"
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

    @Get(":admin")
    @ApiCreatedResponse({ type: Admin })
    async getAdmin(@Param("admin") adminId: string) {
        return this.adminsService.findOne({ id: adminId })
    }

    @Put("update-apikey")
    async updateApiKey(@Body() dto: UpdateApiKeyDTO): Promise<string> {
        return this.adminsService.updateApiKey({
            adminId: dto.adminId,
            action: dto.action
        })
    }
}
