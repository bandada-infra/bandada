import { IsNumberString, IsString, Length } from "class-validator"

export class CreateInviteDto {
    @IsString()
    @Length(32)
    @IsNumberString()
    readonly groupId: string
}
