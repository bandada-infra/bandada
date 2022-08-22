import { IsString } from "class-validator"
import { ServiceType } from "../../auth/types"

export class CreateAccountDTO {
    @IsString()
    service: ServiceType
    @IsString()
    userId: string
    @IsString()
    accessToken: string
    @IsString()
    refreshToken: string
    @IsString()
    username: string
    @IsString()
    fullName: string
    @IsString()
    avatarURL: string
}
