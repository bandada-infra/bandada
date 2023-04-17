import {
    IsString,
    IsNumber,
    Max,
    Min,
    IsOptional,
    MinLength,
    IsBoolean
} from "class-validator"

export class UpdateGroupDto {
    @IsOptional()
    @IsString()
    @MinLength(10)
    readonly description?: string

    @IsOptional()
    @IsNumber()
    @Min(16)
    @Max(32)
    readonly treeDepth?: number

    @IsOptional()
    @IsNumber()
    readonly tag?: number

    @IsOptional()
    @IsBoolean()
    readonly apiEnabled?: boolean

    @IsOptional()
    @IsString()
    readonly apiKey?: string
}
