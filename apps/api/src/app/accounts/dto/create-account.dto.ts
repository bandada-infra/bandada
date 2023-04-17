import { IsOptional, IsString } from "class-validator"

export class CreateAccountDTO {
    @IsString()
    id: string

    @IsOptional()
    @IsString()
    username: string
}
