import { BadRequestException } from "@nestjs/common"
import { Group } from "./entities/group.entity"
import { Admin } from "../admins/entities/admin.entity"
import { AdminsService } from "../admins/admins.service"

export function mapGroupToResponseDTO(group: Group, fingerprint: string = "") {
    const dto = {
        id: group.id,
        name: group.name,
        description: group.description,
        admin: group.adminId,
        treeDepth: group.treeDepth,
        fingerprint,
        fingerprintDuration: group.fingerprintDuration,
        createdAt: group.createdAt,
        members: (group.members || []).map((m) => m.id),
        credentials: group.credentials
    }

    return dto
}

export async function getAndCheckAdmin(
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
