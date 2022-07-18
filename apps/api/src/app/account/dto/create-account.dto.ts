import { IsObject, IsString } from "class-validator"

export class CreateAccountDTO {
    @IsString()
    service: string

    @IsObject()
    tokens: {
        accessToken: string
        userId: string
    }
    @IsString()
    username: string
    @IsString()
    fullName: string
    @IsString()
    avatarURL: string
}
