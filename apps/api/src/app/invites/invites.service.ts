import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { MongoRepository } from "typeorm"
import { GroupsService } from "../groups/groups.service"
import { CreateInviteDto } from "./dto/create-invite.dto"
import { Invite } from "./entities/invite.entity"

@Injectable()
export class InvitesService {
    constructor(
        @InjectRepository(Invite)
        private readonly inviteRepository: MongoRepository<Invite>,
        private readonly groupsService: GroupsService
    ) {}

    async createInvite(
        dto: CreateInviteDto,
        adminUserId: string
    ): Promise<Invite> {
        try {
            const group = await this.groupsService.getGroupData(dto.groupName)

            if (group.admin !== adminUserId) {
                throw new UnauthorizedException(
                    `No permissions: You are not the admin of this group: {'${dto.groupName}'}.`
                )
            }

            const invite = this.inviteRepository.create({
                code: this.generateCode(),
                group,
                redeemed: false
            })

            return this.inviteRepository.save(invite)
        } catch (e) {
            throw new InternalServerErrorException(e.writeErrors)
        }
    }

    private generateCode(len = 8): string {
        const keys = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        let code = ""

        for (let i = 0; i < len; i++) {
            code += keys.charAt(Math.floor(Math.random() * keys.length))
        }

        return code
    }

    //async redeemInvite(code: string, adminUserId: string): Promise<void> {
    //try {
    //const invite = await this.inviteRepository.findOneBy({
    //code
    //})
    //const group = await this.groupsService.getGroupData(
    //invite.group.name
    //)

    //if (group.admin !== adminUserId) {
    //throw new UnauthorizedException(
    //`No permissions: You are not an admin of this group: {'${invite.group.name}'}.`
    //)
    //}

    //await this.inviteRepository.updateOne(
    //{ code },
    //{
    //$set: {
    //redeemed: true
    //}
    //}
    //)
    //} catch (e) {
    //throw new InternalServerErrorException(e.writeErrors)
    //}
    //}
}
