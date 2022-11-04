import {
    IsString,
    IsNumber,
    Max,
    Min,
    IsOptional,
    MinLength
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
}
