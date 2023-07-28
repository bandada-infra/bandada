import { IsOptional, IsString, Length } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AddMemberDto {
    @IsOptional()
    @IsString()
    @Length(8)
    @ApiProperty()
    readonly inviteCode: string
}
