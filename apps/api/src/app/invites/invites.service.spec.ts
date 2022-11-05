import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Group } from "../groups/entities/group.entity"
import { GroupsService } from "../groups/groups.service"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"

describe("InvitesService", () => {
    let invitesService: InvitesService
    let groupsService: GroupsService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: "sqlite",
                        database: ":memory:",
                        dropSchema: true,
                        entities: [Group, Invite],
                        synchronize: true
                    })
                }),
                TypeOrmModule.forFeature([Group]),
                TypeOrmModule.forFeature([Invite])
            ],
            providers: [GroupsService, InvitesService]
        }).compile()

        invitesService = await module.resolve(InvitesService)
        groupsService = await module.resolve(GroupsService)
    })

    describe("# createInvite", () => {
        beforeAll(async () => {
            await groupsService.createGroup(
                {
                    name: "Group1",
                    description: "This is a description",
                    treeDepth: 16
                },
                "admin"
            )
        })

        it("Should create an invite", async () => {
            const { group, code, redeemed } = await invitesService.createInvite(
                { groupName: "Group1" },
                "admin"
            )

            expect(redeemed).toBeFalsy()
            expect(code).toHaveLength(8)
            expect(group.treeDepth).toBe(16)
        })

        it("Should not create an invite if the admin is the wrong one", async () => {
            const fun = invitesService.createInvite(
                { groupName: "Group1" },
                "wrong-admin"
            )

            await expect(fun).rejects.toThrow("You are not the admin")
        })
    })

    describe("# redeemInvite", () => {
        let invite: Invite

        beforeAll(async () => {
            invite = await invitesService.createInvite(
                { groupName: "Group1" },
                "admin"
            )
        })

        it("Should redeem an invite", async () => {
            const { redeemed } = await invitesService.redeemInvite(invite.code)

            expect(redeemed).toBeTruthy()
        })

        it("Should not redeem an invite if it has already been redeemed", async () => {
            const fun = invitesService.redeemInvite(invite.code)

            await expect(fun).rejects.toThrow("has already been redeemed")
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
