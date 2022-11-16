import { Group } from "./group"

export type Invite = {
    _id: string
    code: string
    redeemed: boolean
    group: Group
}
