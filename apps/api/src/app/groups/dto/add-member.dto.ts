import { IsOptional, IsString, Length } from "class-validator"

export class AddMemberDto {
    @IsOptional()
    @IsString()
    @Length(8)
    readonly inviteCode: string

    @IsOptional()
    @IsString()
    readonly oAuthCode: string

    @IsOptional()
    @IsString()
    readonly oAuthState: string
}
