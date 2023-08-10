import { IsString } from "class-validator"

export class AddMemberDto {
    @IsString()
    readonly oAuthCode: string

    @IsString()
    readonly oAuthState: string
}
