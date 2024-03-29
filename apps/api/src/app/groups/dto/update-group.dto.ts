import {
    IsJSON,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateGroupDto {
    @IsOptional()
    @IsString()
    @MinLength(10)
    @ApiProperty()
    readonly description?: string

    @IsOptional()
    @IsNumber()
    @Min(16)
    @Max(32)
    @ApiProperty()
    readonly treeDepth?: number

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    readonly fingerprintDuration?: number

    @IsOptional()
    @IsJSON()
    @ApiProperty()
    readonly credentials?: any
}
