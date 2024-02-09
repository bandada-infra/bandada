import { ApiProperty } from "@nestjs/swagger"
import { Timestamp } from "typeorm"

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
    apiEnabled: boolean
    @ApiProperty()
    apiKey: string
    @ApiProperty()
    createdAt: Timestamp
    @ApiProperty()
    updatedAt: Timestamp
}
