import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateGroupDto{

    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsNumber()
    @Min(16)
    @Max(32)
    readonly treeDepth: number;

}