import {
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Length,
    Min,
    MinLength,
    NotContains,
    IsNumberString,
    IsJSON
} from "class-validator"

export class CreateGroupDto {
    @IsString()
    @IsOptional()
    @Length(32)
    @IsNumberString()
    readonly id?: string

    @IsString()
    @Length(1, 50)
    @NotContains("admin-groups")
    readonly name: string

    @IsString()
    @MinLength(10)
    readonly description: string

    @IsNumber()
    @Min(16)
    @Max(32)
    readonly treeDepth: number

    @IsNumber()
    @Min(0)
    readonly fingerprintDuration: number

    @IsJSON()
    @IsOptional()
    readonly credentials?: any
}
