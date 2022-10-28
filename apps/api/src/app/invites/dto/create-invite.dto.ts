import { IsString, Length } from "class-validator"

export class CreateInviteDto {
    @IsString()
    @Length(1, 50)
    readonly groupName: string
}
