import { Group } from "./entities/group.entity"

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
