import { IsString, IsOptional } from "class-validator"

export class AddMemberDto {
    @IsString()
    readonly oAuthState: string

    @IsOptional()
    @IsString()
    readonly oAuthCode: string

    @IsOptional()
    @IsString()
    readonly address: string
}
