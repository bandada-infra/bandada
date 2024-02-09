import { ApiProperty } from "@nestjs/swagger"
import { Timestamp } from "typeorm"
import { GroupResponse } from "./groupResponse"

export class InviteResponse {
    @ApiProperty()
    code: string
    @ApiProperty()
    isRedeemed: boolean
    @ApiProperty()
    createdAt: Timestamp
    @ApiProperty()
    group: GroupResponse
    @ApiProperty()
    groupName: string
    @ApiProperty()
    groupId: string
}
