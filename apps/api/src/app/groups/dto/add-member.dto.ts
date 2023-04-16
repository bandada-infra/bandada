import { IsString, Length } from "class-validator"

export class AddMemberDto {
    @IsString()
    readonly id: string

    @IsString()
    @Length(8)
    readonly inviteCode: string
}
