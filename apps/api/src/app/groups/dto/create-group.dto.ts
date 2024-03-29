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
import { ApiProperty } from "@nestjs/swagger"

export class CreateGroupDto {
    @IsString()
    @IsOptional()
    @Length(32)
    @IsNumberString()
    readonly id?: string

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
    @Min(16)
    @Max(32)
    @ApiProperty()
    readonly treeDepth: number

    @IsNumber()
    @Min(0)
    @ApiProperty()
    readonly fingerprintDuration: number

    @IsJSON()
    @IsOptional()
    @ApiProperty()
    readonly credentials?: any
}
