import { ApiProperty } from "@nestjs/swagger"
import { GroupResponse } from "./groupResponse"

export class InviteResponse {
    @ApiProperty()
    code: string
    @ApiProperty()
    isRedeemed: boolean
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    group: GroupResponse
}
