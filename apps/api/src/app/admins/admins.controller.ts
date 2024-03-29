import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from "@nestjs/common"
import { ApiExcludeEndpoint } from "@nestjs/swagger"
import { AuthGuard } from "../auth/auth.guard"
import { CreateAdminDTO } from "./dto/create-admin.dto"
import { AdminsService } from "./admins.service"
import { Admin } from "./entities/admin.entity"
import { UpdateApiKeyDTO } from "./dto/update-apikey.dto"

@Controller("admins")
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiExcludeEndpoint()
    async createAdmin(@Body() dto: CreateAdminDTO): Promise<Admin> {
        return this.adminsService.create(dto)
    }

    @Get(":admin")
    @UseGuards(AuthGuard)
    @ApiExcludeEndpoint()
    async getAdmin(@Param("admin") adminId: string) {
        return this.adminsService.findOne({ id: adminId })
    }

    @Put(":admin/apikey")
    @UseGuards(AuthGuard)
    @ApiExcludeEndpoint()
    async updateApiKey(
        @Param("admin") adminId: string,
        @Body() dto: UpdateApiKeyDTO
    ): Promise<string> {
        return this.adminsService.updateApiKey(adminId, dto.action)
    }
}
