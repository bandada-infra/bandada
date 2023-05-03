import { IsOptional, IsString } from "class-validator"

export class CreateAdminDTO {
    @IsString()
    id: string

    @IsString()
    address: string

    @IsOptional()
    @IsString()
    username?: string
}
