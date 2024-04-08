import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApiKeyActions } from "@bandada/utils"
import { Group } from "../groups/entities/group.entity"
import { Member } from "../groups/entities/member.entity"
import { GroupsService } from "../groups/groups.service"
import { OAuthAccount } from "../credentials/entities/credentials-account.entity"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"
import { AdminsModule } from "../admins/admins.module"
import { AdminsService } from "../admins/admins.service"
import { Admin } from "../admins/entities/admin.entity"

jest.mock("@bandada/utils", () => {
    const originalModule = jest.requireActual("@bandada/utils")

    return {
        __esModule: true,
        ...originalModule,
        getBandadaContract: () => ({
            updateGroups: jest.fn(() => ({
                status: true,
                logs: ["1"]
            })),
            getGroups: jest.fn(() => [])
        })
    }
})

describe("InvitesService", () => {
    let invitesService: InvitesService
    let groupsService: GroupsService
    let adminsService: AdminsService
    let groupId: string
    let admin: Admin

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: "sqlite",
                        database: ":memory:",
                        dropSchema: true,
                        entities: [Group, Invite, Member, OAuthAccount, Admin],
                        synchronize: true
                    })
                }),
                TypeOrmModule.forFeature([Group, Invite, Member, Admin]),
                ScheduleModule.forRoot(),
                AdminsModule
            ],
            providers: [GroupsService, InvitesService, AdminsService]
        }).compile()

        invitesService = await module.resolve(InvitesService)
        groupsService = await module.resolve(GroupsService)
        adminsService = await module.resolve(AdminsService)

        admin = await adminsService.create({
            id: "admin",
            address: "0x"
        })

        await adminsService.updateApiKey(admin.id, ApiKeyActions.Generate)

        admin = await adminsService.findOne({ id: admin.id })

        const group = await groupsService.createGroup(
            {
                name: "Group1",
                description: "This is a description",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            admin.id
        )

        groupId = group.id
    })

    describe("# createInvite", () => {
        it("Should create an invite", async () => {
            const {
                group,
                code,
                isRedeemed: redeemed
            } = await invitesService.createInvite({ groupId }, admin.id)

            expect(redeemed).toBeFalsy()
            expect(code).toHaveLength(8)
            expect(group.treeDepth).toBe(16)
        })

        it("Should not create an invite if the admin is the wrong one", async () => {
            const fun = invitesService.createInvite({ groupId }, "wrong-admin")

            await expect(fun).rejects.toThrow("You are not the admin")
        })

        it("Should not create an invite if the group is a credential group", async () => {
            const group = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: {
                        id: "GITHUB_FOLLOWERS",
                        criteria: {
                            minFollowers: 12
                        }
                    }
                },
                admin.id
            )

            const fun = invitesService.createInvite(
                { groupId: group.id },
                admin.id
            )

            await expect(fun).rejects.toThrow(
                "Credential groups cannot be accessed via invites"
            )
        })
    })

    describe("# createInviteManually", () => {
        it("Should create an invite manually", async () => {
            const {
                group,
                code,
                isRedeemed: redeemed
            } = await invitesService.createInviteManually({ groupId }, admin.id)

            expect(redeemed).toBeFalsy()
            expect(code).toHaveLength(8)
            expect(group.treeDepth).toBe(16)
        })

        it("Should not create an invite if the given identifier does not belong to an admin", async () => {
            const fun = invitesService.createInviteManually(
                { groupId },
                "wrong-admin"
            )

            await expect(fun).rejects.toThrow("You are not an admin")
        })

        it("Should not create an invite if the admin is the wrong one", async () => {
            const admin2 = await adminsService.create({
                id: "admin2",
                address: "0x02"
            })

            await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: {
                        id: "GITHUB_FOLLOWERS",
                        criteria: {
                            minFollowers: 12
                        }
                    }
                },
                admin2.id
            )

            const fun = invitesService.createInviteManually(
                { groupId },
                admin2.id
            )

            await expect(fun).rejects.toThrow("You are not the admin")
        })

        it("Should not create an invite if the group is a credential group", async () => {
            const admin3 = await adminsService.create({
                id: "admin3",
                address: "0x04"
            })

            const group = await groupsService.createGroup(
                {
                    name: "Group3",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: {
                        id: "GITHUB_FOLLOWERS",
                        criteria: {
                            minFollowers: 12
                        }
                    }
                },
                admin3.id
            )

            const fun = invitesService.createInviteManually(
                { groupId: group.id },
                admin3.id
            )

            await expect(fun).rejects.toThrow(
                "Credential groups cannot be accessed via invites"
            )
        })
    })

    describe("# createInviteWithApiKey", () => {
        it("Should create an invite manually", async () => {
            const {
                group,
                code,
                isRedeemed: redeemed
            } = await invitesService.createInviteWithApiKey(
                { groupId },
                admin.apiKey
            )

            expect(redeemed).toBeFalsy()
            expect(code).toHaveLength(8)
            expect(group.treeDepth).toBe(16)
        })

        it("Should not create an invite if the given api key is invalid", async () => {
            const fun = invitesService.createInviteWithApiKey(
                { groupId },
                "wrong-apikey"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the group '${groupId}'`
            )
        })

        it("Should not create an invite if the given api key does not belong to an admin", async () => {
            const oldApiKey = admin.apiKey

            await adminsService.updateApiKey(admin.id, ApiKeyActions.Generate)

            const fun = invitesService.createInviteWithApiKey(
                { groupId },
                oldApiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the group '${groupId}'`
            )
        })

        it("Should not create an invite if the given api key is disabled", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            admin = await adminsService.findOne({ id: admin.id })

            const fun = invitesService.createInviteWithApiKey(
                { groupId },
                admin.apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })

        it("Should not create an invite if the admin is the wrong one", async () => {
            let admin2 = await adminsService.create({
                id: "admin2",
                address: "0x02"
            })

            await adminsService.updateApiKey(admin2.id, ApiKeyActions.Generate)

            admin2 = await adminsService.findOne({ id: admin2.id })

            await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: {
                        id: "GITHUB_FOLLOWERS",
                        criteria: {
                            minFollowers: 12
                        }
                    }
                },
                admin2.id
            )

            const fun = invitesService.createInviteWithApiKey(
                { groupId },
                admin2.apiKey
            )

            await expect(fun).rejects.toThrow("You are not the admin")
        })

        it("Should not create an invite if the group is a credential group", async () => {
            let admin3 = await adminsService.create({
                id: "admin3",
                address: "0x04"
            })

            await adminsService.updateApiKey(admin3.id, ApiKeyActions.Generate)

            admin3 = await adminsService.findOne({ id: admin3.id })

            const group = await groupsService.createGroup(
                {
                    name: "Group3",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: {
                        id: "GITHUB_FOLLOWERS",
                        criteria: {
                            minFollowers: 12
                        }
                    }
                },
                admin3.id
            )

            const fun = invitesService.createInviteWithApiKey(
                { groupId: group.id },
                admin3.apiKey
            )

            await expect(fun).rejects.toThrow(
                "Credential groups cannot be accessed via invites"
            )
        })
    })

    describe("# getInvite", () => {
        it("Should get an invite", async () => {
            const { code } = await invitesService.createInvite(
                { groupId },
                admin.id
            )

            const invite = await invitesService.getInvite(code)

            expect(invite.isRedeemed).toBeFalsy()
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
            invite = await invitesService.createInvite({ groupId }, admin.id)
        })

        it("Should not redeem an invite if group name does not match", async () => {
            const fun = invitesService.redeemInvite(invite.code, "wrong-group")

            await expect(fun).rejects.toThrow("is not for 'wrong-group'")
        })

        it("Should redeem an invite", async () => {
            const { isRedeemed: redeemed } = await invitesService.redeemInvite(
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
