import { BadRequestException } from "@nestjs/common"
import { Group } from "./entities/group.entity"
import { Admin } from "../admins/entities/admin.entity"

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

export async function adminApiKeyCheck(
    admin: Admin,
    apiKey: string,
    groupId?: string
) {
    if (!admin) {
        throw new BadRequestException(
            groupId
                ? `Invalid admin for the group '${groupId}'`
                : `Invalid admin for the groups`
        )
    }

    if (!admin.apiEnabled || admin.apiKey !== apiKey) {
        throw new BadRequestException(
            `Invalid API key or API access not enabled for admin '${admin.id}'`
        )
    }
}
