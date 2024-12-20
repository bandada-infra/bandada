import { ApiProperty } from "@nestjs/swagger"
import { ArrayNotEmpty, IsArray } from "class-validator"

export class AddMemberToGroupsDto {
    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty()
    readonly groupIds: string[]
}
