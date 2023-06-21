import { IsString } from "class-validator"

export class SignInWithEthereumDTO {
    @IsString()
    message: string

    @IsString()
    signature: string
}
