import { Group } from "./entities/group.entity"

export function mapGroupToResponseDTO(group: Group, includeAPIKey: boolean = false) {
    const dto = {
        id: group.id,
        name: group.name,
        description: group.description,
        admin: group.admin,
        treeDepth: group.treeDepth,
        createdAt: group.createdAt,
        members: (group.members || []).map((m) => m.id),
        apiKey: undefined,
        apiEnabled: undefined
    }

    if (includeAPIKey) {
        dto.apiKey = group.apiKey
        dto.apiEnabled = group.apiEnabled
    }

    return dto
}
