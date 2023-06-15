import { IsNumberString, IsString } from "class-validator"
import { OAuthProvider } from "../types"

export class OAuthStateDto {
    @IsNumberString()
    readonly groupId: string

    @IsNumberString()
    readonly memberId: string

    @IsString()
    readonly provider: OAuthProvider

    @IsString()
    readonly redirectURI?: string
}
