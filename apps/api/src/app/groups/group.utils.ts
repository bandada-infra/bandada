import { Group } from "./entities/group.entity"

export function mapGroupToResponseDTO(group: Group) {
    return {
        ...group,
        members: (group.members || []).map((m) => m.id)
    }
}
