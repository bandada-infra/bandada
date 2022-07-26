import { Injectable } from "@nestjs/common"
import { AddMemberDto } from "./dto/add-member.dto"
import { Member } from "./entities/member.entity"

@Injectable()
export class MembersService {
    private members: Member[] = []

    getAllMembers(): Member[] {
        return this.members
    }

    getMemberByIndex(index: number): Member {
        return this.members.find((member) => member.index === index)
    }

    addMember(memberData: AddMemberDto) {
        const newIndex = (this.members.length === 0 ? 1 : Math.max(...this.members.map((member) => member.index)) + 1)
        this.members.push({
            index: newIndex,
            ...memberData
        })
        return `New member has added with index:${newIndex}`
    }
}
