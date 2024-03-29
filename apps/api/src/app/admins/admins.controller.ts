import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common"
import { ApiCreatedResponse } from "@nestjs/swagger"
import { CreateAdminDTO } from "./dto/create-admin.dto"
import { AdminsService } from "./admins.service"
import { Admin } from "./entities/admin.entity"
import { UpdateApiKeyDTO } from "./dto/update-apikey.dto"

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

    @Put(":admin/apikey")
    async updateApiKey(
        @Param("admin") adminId: string,
        @Body() dto: UpdateApiKeyDTO
    ): Promise<string> {
        return this.adminsService.updateApiKey(adminId, dto.action)
    }
}
