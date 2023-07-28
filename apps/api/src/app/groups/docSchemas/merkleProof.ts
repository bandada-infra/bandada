import { ApiProperty } from "@nestjs/swagger"

export class MerkleProof {
    @ApiProperty()
    root: string
    @ApiProperty()
    leaf: string
    @ApiProperty({ isArray: true })
    pathIndices: number
    @ApiProperty({ isArray: true })
    siblings: string
}
