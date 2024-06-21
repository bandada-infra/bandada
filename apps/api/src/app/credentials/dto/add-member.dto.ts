import { IsArray, ArrayNotEmpty, IsOptional } from "class-validator"

export class AddMemberDto {
    @IsArray()
    @ArrayNotEmpty()
    readonly oAuthState: string[]

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    readonly oAuthCode: string[]

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    readonly address: string[]
}
