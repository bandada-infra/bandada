import { ApiProperty } from "@nestjs/swagger"
import { ArrayNotEmpty, IsArray } from "class-validator"

export class RemoveMembersDto {
    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty()
    readonly memberIds: string[]
}
