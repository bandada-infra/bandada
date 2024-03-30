import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common"
import { ApiExcludeController } from "@nestjs/swagger"
import { AuthGuard } from "../auth/auth.guard"
import { AdminsService } from "./admins.service"
import { UpdateApiKeyDTO } from "./dto/update-apikey.dto"

@ApiExcludeController()
@Controller("admins")
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Get(":admin")
    @UseGuards(AuthGuard)
    async getAdmin(@Param("admin") adminId: string) {
        return this.adminsService.findOne({ id: adminId })
    }

    @Put(":admin/apikey")
    @UseGuards(AuthGuard)
    async updateApiKey(
        @Param("admin") adminId: string,
        @Body() dto: UpdateApiKeyDTO
    ): Promise<string> {
        return this.adminsService.updateApiKey(adminId, dto.action)
    }
}
