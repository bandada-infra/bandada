import { IsNumber, IsOptional, IsString, Max, Length, Min, MinLength } from "class-validator";


export class CreateGroupDto{

    @IsString()
    @Length(1,50)
    readonly name: string;

    @IsString()
    @MinLength(10)
    readonly description: string;

    @IsNumber()
    @Min(16)
    @Max(32)
    readonly treeDepth: number;

    @IsOptional()
    @IsNumber()
    readonly tag?: number;
}