import { ApiProperty } from "@nestjs/swagger"

export class GroupResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    adminId: string
    @ApiProperty()
    treeDepth: number
    @ApiProperty()
    fingerprintDuration: number
    @ApiProperty()
    credentials: object
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
}
