import { ApiProperty } from "@nestjs/swagger"
import { IsNumberString, IsString, Length } from "class-validator"

export class CreateInviteDto {
    @IsString()
    @Length(32)
    @IsNumberString()
    @ApiProperty()
    readonly groupId: string
}
