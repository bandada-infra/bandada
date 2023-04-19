import { IsOptional, IsString } from "class-validator"

export class CreateUserDTO {
    @IsString()
    id: string

    @IsString()
    address: string

    @IsOptional()
    @IsString()
    username?: string
}
