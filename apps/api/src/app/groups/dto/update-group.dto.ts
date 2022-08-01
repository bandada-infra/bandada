import { IsString } from "class-validator";

export class UpdateGroupDto{
    
    @IsString()
    readonly name?: string;

    @IsString()
    readonly description?: string;
}
