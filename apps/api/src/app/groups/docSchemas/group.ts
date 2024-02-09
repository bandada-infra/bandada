import { ApiProperty } from "@nestjs/swagger"
import { Timestamp } from "typeorm"

export class Group {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    admin: string
    @ApiProperty()
    treeDepth: number
    @ApiProperty()
    fingerprint: string
    @ApiProperty()
    fingerprintDuration: number
    @ApiProperty()
    createdAt: Timestamp
    @ApiProperty({ isArray: true })
    members: string
    @ApiProperty()
    credentials: object
}
