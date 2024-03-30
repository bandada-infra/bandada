import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common"
import { ApiExcludeEndpoint } from "@nestjs/swagger"
import { AuthGuard } from "../auth/auth.guard"
import { AdminsService } from "./admins.service"
import { UpdateApiKeyDTO } from "./dto/update-apikey.dto"

@Controller("admins")
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

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
