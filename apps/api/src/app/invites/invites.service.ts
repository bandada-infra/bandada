import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { GroupsService } from "../groups/groups.service"
import { CreateInviteDto } from "./dto/create-invite.dto"
import { Invite } from "./entities/invite.entity"

@Injectable()
export class InvitesService {
    constructor(
        @InjectRepository(Invite)
        private readonly inviteRepository: Repository<Invite>,
        @Inject(forwardRef(() => GroupsService))
        private readonly groupsService: GroupsService
    ) {}

    /**
     * Creates a new group invite with a unique code. Group invites can only be
     * created by group admins.
     * @param dto Data transfer object used to create new invites.
     * @param adminUserId Group admin.
     * @returns The created invite.
     */
    async createInvite(
        dto: CreateInviteDto,
        adminUserId: string
    ): Promise<Invite> {
        const group = await this.groupsService.getGroupData(dto.groupName)

        if (group.admin !== adminUserId) {
            throw new UnauthorizedException(
                `No permissions: You are not the admin of this group: {'${dto.groupName}'}.`
            )
        }

        const invite = this.inviteRepository.create({
            code: this.generateCode(),
            group
        })

        try {
            return this.inviteRepository.save(invite)
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    /**
     * Redeems an invite by consuming its code. Every invite
     * can be used only once.
     * @param inviteCode Invite code to be redeemed.
     */
    async redeemInvite(inviteCode: string): Promise<Invite> {
        const invite = await this.inviteRepository.findOneBy({
            code: inviteCode
        })

        if (invite.redeemed === true) {
            throw new BadRequestException(
                `Invite code '${inviteCode}' has already been redeemed`
            )
        }

        invite.redeemed = true

        try {
            return this.inviteRepository.save(invite)
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    /**
     * Generates a random code with a given number of characters.
     * The list of available characters have been chosen to be human readable.
     * @param length Number of characters.
     * @returns The generated code.
     */
    private generateCode(length = 8): string {
        const keys = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        let code = ""

        for (let i = 0; i < length; i++) {
            code += keys.charAt(Math.floor(Math.random() * keys.length))
        }

        return code
    }
}
