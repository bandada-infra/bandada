import { IsArray, ArrayNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UpdateGroupDto } from "./update-group.dto"

export class UpdateGroupsDto {
    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty()
    readonly groupIds: string[]

    @IsArray()
    @ApiProperty()
    readonly groupsInfo: UpdateGroupDto[]
}
