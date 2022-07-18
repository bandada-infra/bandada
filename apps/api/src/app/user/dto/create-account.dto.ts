import { IsString } from "class-validator"

export class CreateAccountDTO {
    @IsString()
    readonly email: string
}
