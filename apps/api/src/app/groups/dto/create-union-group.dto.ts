import {
    ArrayNotEmpty,
    IsArray,
    IsNumber,
    IsString,
    Length,
    Max,
    Min,
    MinLength,
    NotContains
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUnionGroupDto {
    @IsString()
    @Length(1, 50)
    @NotContains("admin-groups")
    @ApiProperty()
    readonly name: string

    @IsString()
    @MinLength(10)
    @ApiProperty()
    readonly description: string

    @IsNumber()
    @Min(16, { message: "The tree depth must be between 16 and 32." })
    @Max(32, { message: "The tree depth must be between 16 and 32." })
    @ApiProperty()
    readonly treeDepth: number

    @IsNumber()
    @Min(0)
    @ApiProperty()
    readonly fingerprintDuration: number
    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty()
    readonly groupIds: string[]
}
