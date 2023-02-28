import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Group } from "../groups/entities/group.entity"
import { Member } from "../groups/entities/member.entity"
import { GroupsService } from "../groups/groups.service"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"

describe("InvitesService", () => {
    let invitesService: InvitesService
    let groupsService: GroupsService
    let groupId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: "sqlite",
                        database: ":memory:",
                        dropSchema: true,
                        entities: [Group, Invite, Member],
                        synchronize: true
                    })
                }),
                TypeOrmModule.forFeature([Group, Invite, Member]),
                ScheduleModule.forRoot()
            ],
            providers: [GroupsService, InvitesService]
        }).compile()

        invitesService = await module.resolve(InvitesService)
        groupsService = await module.resolve(GroupsService)

        const createdGroup = await groupsService.createGroup(
            {
                name: "Group1",
                description: "This is a description",
                treeDepth: 16
            },
            "admin"
        )
        groupId = createdGroup.id
    })

    describe("# createInvite", () => {
        it("Should create an invite", async () => {
            const { group, code, redeemed } = await invitesService.createInvite(
                { groupId },
                "admin"
            )

            expect(redeemed).toBeFalsy()
            expect(code).toHaveLength(8)
            expect(group.treeDepth).toBe(16)
        })

        it("Should not create an invite if the admin is the wrong one", async () => {
            const fun = invitesService.createInvite({ groupId }, "wrong-admin")

            await expect(fun).rejects.toThrow("You are not the admin")
        })
    })

    describe("# getInvite", () => {
        it("Should get an invite", async () => {
            const { code } = await invitesService.createInvite(
                { groupId },
                "admin"
            )

            const invite = await invitesService.getInvite(code)

            expect(invite.redeemed).toBeFalsy()
            expect(invite.code).toHaveLength(8)
            expect(invite.group).toBeDefined()
        })

        it("Should return null if invite code does not exist", async () => {
            const invite = await invitesService.getInvite("12345")

            expect(invite).toBeNull()
        })
    })

    describe("# redeemInvite", () => {
        let invite: Invite

        beforeAll(async () => {
            invite = await invitesService.createInvite({ groupId }, "admin")
        })

        it("Should not redeem an invite if group name does not match", async () => {
            const fun = invitesService.redeemInvite(invite.code, "wrong-group")

            await expect(fun).rejects.toThrow("is not for 'wrong-group'")
        })

        it("Should redeem an invite", async () => {
            const { redeemed } = await invitesService.redeemInvite(
                invite.code,
                groupId
            )

            expect(redeemed).toBeTruthy()
        })

        it("Should not redeem an invite if it has already been redeemed", async () => {
            const fun = invitesService.redeemInvite(invite.code, groupId)

            await expect(fun).rejects.toThrow("has already been redeemed")
        })

        it("Should not redeem an invite if it does not exist", async () => {
            const fun = invitesService.redeemInvite("12345", groupId)

            await expect(fun).rejects.toThrow("does not exist")
        })
    })

    describe("# generateCode", () => {
        it("Should generate a random code with 8 characters", async () => {
            const result = (invitesService as any).generateCode()

            expect(typeof result).toBe("string")
            expect(result).toHaveLength(8)
        })

        it("Should generate a random code with 16 characters", async () => {
            const result = (invitesService as any).generateCode(16)

            expect(typeof result).toBe("string")
            expect(result).toHaveLength(16)
        })
    })
})
