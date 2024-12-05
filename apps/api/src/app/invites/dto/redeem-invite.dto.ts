import { ApiProperty } from "@nestjs/swagger"
import { IsNumberString, IsString, Length } from "class-validator"

export class RedeemInviteDto {
    @IsString()
    @Length(8)
    @ApiProperty()
    readonly inviteCode: string

    @IsString()
    @Length(32)
    @IsNumberString()
    @ApiProperty()
    readonly groupId: string
}
