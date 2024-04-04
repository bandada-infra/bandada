import { BadRequestException } from "@nestjs/common"
import { AdminsService } from "../admins/admins.service"
import { Admin } from "../admins/entities/admin.entity"

export default async function getAndCheckAdmin(
    adminService: AdminsService,
    apiKey: string,
    groupId?: string
): Promise<Admin> {
    const admin = await adminService.findOne({ apiKey })

    if (!apiKey || !admin) {
        throw new BadRequestException(
            groupId
                ? `Invalid API key or invalid admin for the group '${groupId}'`
                : `Invalid API key or invalid admin for the groups`
        )
    }

    if (!admin.apiEnabled || admin.apiKey !== apiKey) {
        throw new BadRequestException(
            `Invalid API key or API access not enabled for admin '${admin.id}'`
        )
    }

    return admin
}
