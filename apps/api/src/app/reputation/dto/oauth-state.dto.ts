import { IsNumberString, IsOptional, IsString } from "class-validator"

export class OAuthStateDto {
    @IsNumberString()
    readonly groupId: string

    @IsNumberString()
    readonly memberId: string

    @IsString()
    readonly providerName: string

    @IsString()
    @IsOptional()
    readonly redirectUri?: string
}
