import { ApiProperty } from "@nestjs/swagger"
import { ArrayNotEmpty, IsArray } from "class-validator"

export class AddMembersDto {
    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty()
    readonly memberIds: string[]
}
