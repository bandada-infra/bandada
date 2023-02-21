import { Group } from "./group"

export type Invite = {
    code: string
    redeemed: boolean
    groupName: string
    groupId: string
}
