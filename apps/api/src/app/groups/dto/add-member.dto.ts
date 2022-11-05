import { IsString, Length } from "class-validator"

export class AddMemberDto {
    @IsString()
    @Length(8)
    readonly inviteCode: string
}
