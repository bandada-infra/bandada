import { Group } from "./group"

export type Invite = {
    code: string
    isRedeemed: boolean
    groupName: string
    groupId: string
}
