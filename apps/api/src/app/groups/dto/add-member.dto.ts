import { IsOptional, IsString, Length } from "class-validator"

export class AddMemberDto {
    @IsString()
    readonly id: string

    @IsOptional()
    @IsString()
    @Length(8)
    readonly inviteCode: string
}
