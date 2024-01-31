import { IsString, IsOptional } from "class-validator"

export class AddMemberDto {
    @IsOptional()
    @IsString()
    readonly oAuthCode: string

    @IsString()
    readonly oAuthState: string

    @IsOptional()
    @IsString()
    readonly address: string

    @IsOptional()
    @IsString()
    readonly blockNumber: string
}
