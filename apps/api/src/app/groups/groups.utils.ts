import { Group } from "./entities/group.entity"

export function mapGroupToResponseDTO(
    group: Group,
    includeAPIKey: boolean = false
) {
    const dto = {
        id: group.id,
        name: group.name,
        description: group.description,
        admin: group.adminId,
        treeDepth: group.treeDepth,
        fingerprintDuration: group.fingerprintDuration,
        createdAt: group.createdAt,
        members: (group.members || []).map((m) => m.id),
        credentials: group.credentials,
        apiKey: undefined,
        apiEnabled: undefined
    }

    if (includeAPIKey) {
        dto.apiKey = group.apiKey
        dto.apiEnabled = group.apiEnabled
    }

    return dto
}
