import {
    Body,
    Controller,
    Get,
    NotAcceptableException,
    NotFoundException,
    Param,
    Post
} from "@nestjs/common"
import { AddMemberDto } from "./dto/add-member.dto"
import { Member } from "./entities/member.entity"
import { MembersService } from "./members.service"

@Controller("members")
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @Get(":groupId")
    getAllMembers(@Param("groupId") groupId: string): Member[] {
        return this.membersService.getAllMembers()
    }

    @Get(":groupId/:index")
    getMemberByIndex(@Param("index") index: number) {
        const member = this.membersService.getMemberByIndex(index)
        if (!member) {
            throw new NotFoundException(`Member ID: ${index} not found`)
        }
        return member
    }

    @Post(":groupId")
    addMember(
        @Param("groupId") groupId: string,
        @Body() memberData: AddMemberDto
    ) {
        const identityCommitmentsList = this.getAllMembers(groupId).map(
            (member) => member.identityCommitment
        )
        if (identityCommitmentsList.includes(memberData.identityCommitment)) {
            throw new NotAcceptableException(
                `Member with IdentityCommitment:${memberData.identityCommitment} already exist`
            )
        }
        return this.membersService.addMember(memberData)
    }
}
