import { Group } from "./entities/group.entity"

export function mapGroupToResponseDTO(group: Group) {
    return {
        id: group.id,
        name: group.name,
        description: group.description,
        admin: group.admin,
        treeDepth: group.treeDepth,
        createdAt: group.createdAt,
        members: (group.members || []).map((m) => m.id)
    }
}
