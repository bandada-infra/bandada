import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    Logger,
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
     * @param dto External parameters used to create a new Invite.
     * @param groupAdmin Group admin.
     * @returns The created invite.
     */
    async createInvite(
        { groupName }: CreateInviteDto,
        groupAdmin: string
    ): Promise<Invite> {
        const group = await this.groupsService.getGroup(groupName)

        if (group.admin !== groupAdmin) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupName}'`
            )
        }

        const invite = this.inviteRepository.create({
            code: this.generateCode(),
            group
        })

        await this.inviteRepository.save(invite)

        Logger.log(`InvitesService: invite '${invite.code}' has been created`)

        return invite
    }

    async getCodeInfo(inviteCode: string): Promise<any> {
        const invite = await this.inviteRepository.findOneBy({
            code: inviteCode
        })

        return invite
    }

    /**
     * Redeems an invite by consuming its code. Every invite
     * can be used only once.
     * @param inviteCode Invite code to be redeemed.
     * @returns The updated invite.
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

        return this.inviteRepository.save(invite)
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
