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
import { getAndCheckAdmin } from "../utils"
import { AdminsService } from "../admins/admins.service"

@Injectable()
export class InvitesService {
    constructor(
        @InjectRepository(Invite)
        private readonly inviteRepository: Repository<Invite>,
        @Inject(forwardRef(() => GroupsService))
        private readonly groupsService: GroupsService,
        private readonly adminsService: AdminsService
    ) {}

    /**
     * Create a new group invite using API Key.
     * @param dto External parameters used to create a new group invite.
     * @param apiKey the API Key.
     * @returns The group invite.
     */
    async createInviteWithApiKey(
        dto: CreateInviteDto,
        apiKey: string
    ): Promise<Invite> {
        const admin = await getAndCheckAdmin(
            this.adminsService,
            apiKey,
            dto.groupId
        )

        return this.createInvite(dto, admin.id)
    }

    /**
     * Create a new group invite manually without using API Key.
     * @param dto External parameters used to create a new group invite.
     * @param adminId Group admin id.
     * @returns The group invite.
     */
    async createInviteManually(
        dto: CreateInviteDto,
        adminId: string
    ): Promise<Invite> {
        const admin = await this.adminsService.findOne({ id: adminId })

        if (!admin) throw new BadRequestException(`You are not an admin`)

        return this.createInvite(dto, adminId)
    }

    /**
     * Creates a new group invite with a unique code. Group invites can only be
     * created by group admins.
     * @param dto External parameters used to create a new Invite.
     * @param adminId Group admin id.
     * @returns The created invite.
     */
    async createInvite(
        { groupId }: CreateInviteDto,
        adminId: string
    ): Promise<Invite> {
        const group = await this.groupsService.getGroup(groupId)

        if (group.adminId !== adminId.toString()) {
            throw new UnauthorizedException(
                `You are not the admin of the group '${groupId}'`
            )
        }

        if (group.credentials) {
            throw new UnauthorizedException(
                "Credential groups cannot be accessed via invites"
            )
        }

        // Remove unnecessary parameters.
        delete group.members
        delete group.oAuthAccounts

        const invite = this.inviteRepository.create({
            code: this.generateCode(),
            group
        })

        await this.inviteRepository.save(invite)

        Logger.log(`InvitesService: invite '${invite.code}' has been created`)

        return invite
    }

    /**
     * Returns the invite of a specific code.
     * @param inviteCode Invite code.
     * @returns The invite data.
     */
    async getInvite(inviteCode: string): Promise<Invite> {
        const invite = await this.inviteRepository.findOne({
            where: {
                code: inviteCode
            },
            relations: ["group"]
        })

        return invite
    }

    /**
     * Redeems an invite by consuming its code. Every invite
     * can be used only once.
     * @param inviteCode Invite code to be redeemed.
     * @returns The updated invite.
     */
    async redeemInvite(inviteCode: string, groupId: string): Promise<Invite> {
        const invite = await this.getInvite(inviteCode)

        if (invite === null) {
            throw new BadRequestException(
                `Invite code '${inviteCode}' does not exist`
            )
        }

        if (invite.isRedeemed === true) {
            throw new BadRequestException(
                `Invite code '${inviteCode}' has already been redeemed`
            )
        }

        if (invite.group.id !== groupId) {
            throw new BadRequestException(
                `Invite code '${inviteCode}' is not for '${groupId}'`
            )
        }

        invite.isRedeemed = true

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

        for (let i = 0; i < length; i += 1) {
            code += keys.charAt(Math.floor(Math.random() * keys.length))
        }

        return code
    }
}
