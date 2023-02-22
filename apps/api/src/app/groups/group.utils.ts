import { Group } from "./entities/group.entity";


export function mapGroupToResponseDTO(group: Group) {
    return {
        ...group,
        id: undefined,
        members: (group.members || []).map(m => m.id)
    }
}