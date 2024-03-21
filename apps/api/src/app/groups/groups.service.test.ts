import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Invite } from "../invites/entities/invite.entity"
import { InvitesService } from "../invites/invites.service"
import { OAuthAccount } from "../credentials/entities/credentials-account.entity"
import { Group } from "./entities/group.entity"
import { Member } from "./entities/member.entity"
import { GroupsService } from "./groups.service"
import { AdminsService } from "../admins/admins.service"
import { AdminsModule } from "../admins/admins.module"
import { Admin } from "../admins/entities/admin.entity"
import { ApiKeyActions } from "../../types"

jest.mock("@bandada/utils", () => ({
    __esModule: true,
    getBandadaContract: () => ({
        updateGroups: jest.fn(() => ({
            status: true,
            logs: ["1"]
        })),
        getGroups: jest.fn(() => []),
        updateFingerprintDuration: jest.fn(() => null)
    })
}))

describe("GroupsService", () => {
    let groupsService: GroupsService
    let invitesService: InvitesService
    let adminsService: AdminsService
    let groupId: string

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

        groupsService = await module.resolve(GroupsService)
        invitesService = await module.resolve(InvitesService)
        adminsService = await module.resolve(AdminsService)

        await groupsService.initialize()

        const { id } = await groupsService.createGroup(
            {
                name: "Group1",
                description: "This is a description",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            "admin"
        )

        groupId = id
    })

    describe("# createGroup", () => {
        it("Should create a group", async () => {
            const { treeDepth, members } = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                "admin"
            )

            expect(treeDepth).toBe(16)
            expect(members).toHaveLength(0)
        })
    })

    describe("# removeGroup", () => {
        it("Should remove an existing group", async () => {
            const { id } = await groupsService.createGroup(
                {
                    name: "Group3",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                "admin"
            )

            await groupsService.removeGroup(id, "admin")

            const fun = groupsService.getGroup(id)

            await expect(fun).rejects.toThrow(
                `Group with id '${id}' does not exist`
            )
        })

        it("Should not remove a group if the admin is the wrong one", async () => {
            const fun = groupsService.removeGroup(groupId, "wrong-admin")

            await expect(fun).rejects.toThrow("You are not the admin")
        })
    })

    describe("# updateGroup", () => {
        it("Should update a group", async () => {
            const { id } = await groupsService.createGroup(
                {
                    name: "Group4",
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
                "admin"
            )

            const { description, fingerprintDuration, credentials } =
                await groupsService.updateGroup(
                    id,
                    {
                        description: "This is a new description",
                        fingerprintDuration: 1000,
                        credentials: {
                            id: "TWITTER_FOLLOWERS",
                            minFollowers: 23
                        }
                    },
                    "admin"
                )

            expect(description).toContain("new")
            expect(fingerprintDuration).toBe(1000)
            expect(credentials.id).toBe("TWITTER_FOLLOWERS")
        })

        it("Should not update a group if the admin is the wrong one", async () => {
            const fun = groupsService.updateGroup(
                groupId,
                {
                    description: "This is a new description"
                },
                "wrong-admin"
            )

            await expect(fun).rejects.toThrow("You are not the admin")
        })

        it("Should update a group if the treeDepth changes", async () => {
            const newTreeDepth = 20
            const { treeDepth } = await groupsService.updateGroup(
                groupId,
                {
                    treeDepth: newTreeDepth
                },
                "admin"
            )

            expect(treeDepth).toBe(newTreeDepth)
            // expect(
            //     // @ts-ignore
            //     groupsService.bandadaContract.updateGroups
            // ).toHaveBeenCalled()
        })
    })

    describe("# getAllGroupsData", () => {
        it("Should return a list of groups", async () => {
            const result = await groupsService.getGroups()

            expect(result).toHaveLength(3)
        })

        it("Should return a list of groups by admin", async () => {
            await groupsService.createGroup(
                {
                    name: "Group01",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                "admin01"
            )

            // Create a group with another adminId - shouldn't be fetched below
            await groupsService.createGroup(
                {
                    name: "Group02",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                "admin02"
            )

            const result = await groupsService.getGroups({
                adminId: "admin01"
            })

            expect(result).toHaveLength(1)
        })
    })

    describe("# getGroup", () => {
        it("Should return a group", async () => {
            const { treeDepth, members } = await groupsService.getGroup(groupId)

            expect(treeDepth).toBe(20)
            expect(members).toHaveLength(0)
        })

        it("Should throw 404 error about not exist group", async () => {
            const fun = groupsService.getGroup("Group2")

            await expect(fun).rejects.toThrow("does not exist")
        })
    })

    describe("# addMember", () => {
        let invite: Invite

        beforeAll(async () => {
            invite = await invitesService.createInvite({ groupId }, "admin")
        })

        it("Should add a member to an existing group", async () => {
            const { members } = await groupsService.joinGroup(
                groupId,
                "123123",
                { inviteCode: invite.code }
            )

            expect(members).toHaveLength(1)
        })

        // eslint-disable-next-line
        // it("Should update contract on adding member", async () => {
        //     const invite2 = await invitesService.createInvite(
        //         { groupId },
        //         "admin"
        //     )

        //     await groupsService.joinGroup(groupId, "124", {
        //         inviteCode: invite2.code
        //     })

        //     expect(
        //         // @ts-ignore
        //         groupsService.bandadaContract.updateGroups
        //     ).toHaveBeenCalled()
        // })

        it("Should not add any member if they already exist", async () => {
            const fun = groupsService.joinGroup(groupId, "123123", {
                inviteCode: invite.code
            })

            await expect(fun).rejects.toThrow("already exists")
        })
    })

    describe("# isGroupMember", () => {
        it("Should return false if a member does not exist", () => {
            const result = groupsService.isGroupMember(groupId, "123122")

            expect(result).toBeFalsy()
        })

        it("Should return true if a member exists", () => {
            const result = groupsService.isGroupMember(groupId, "123123")

            expect(result).toBeTruthy()
        })
    })

    describe("# generateMerkleProof", () => {
        it("Should return a Merkle proof", () => {
            const merkleproof = groupsService.generateMerkleProof(
                groupId,
                "123123"
            )

            expect(merkleproof).toBeDefined()
        })

        it("Should not return any Merkle proof if the member does not exist", async () => {
            const fun = () =>
                groupsService.generateMerkleProof(groupId, "123122")

            expect(fun).toThrow("does not exist")
        })
    })

    describe("# removeMemberManually", () => {
        it("Should remove a member if they exist in the group", async () => {
            const { id: _groupId } = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 21,
                    fingerprintDuration: 3600
                },
                "admin"
            )

            const invite = await invitesService.createInvite(
                { groupId: _groupId },
                "admin"
            )

            const { members } = await groupsService.joinGroup(
                _groupId,
                "111000",
                { inviteCode: invite.code }
            )

            expect(members).toHaveLength(1)

            const { members: newMembers } =
                await groupsService.removeMemberManually(
                    _groupId,
                    "111000",
                    "admin"
                )

            expect(newMembers).toHaveLength(0)
        })

        it("Should throw error if member is not part of the group", async () => {
            const fun = groupsService.removeMemberManually(
                groupId,
                "00000",
                "admin"
            )

            await expect(fun).rejects.toThrow("is not a member of group")
        })

        it("Should throw error if member is removed by a non-admin", async () => {
            const { id: _groupId } = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 21,
                    fingerprintDuration: 3600
                },
                "admin"
            )

            const invite = await invitesService.createInvite(
                { groupId: _groupId },
                "admin"
            )

            await groupsService.joinGroup(_groupId, "111000", {
                inviteCode: invite.code
            })

            const fun = groupsService.removeMemberManually(
                _groupId,
                "111000",
                "rndom"
            )

            await expect(fun).rejects.toThrow("You are not the admin")
        })
    })

    describe("# Add and remove member via API", () => {
        let admin: Admin
        let group: Group
        let apiKey: string

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            apiKey = await adminsService.updateApiKey({
                adminId: admin.id,
                action: ApiKeyActions.Generate
            })

            group = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                admin.id
            )

            admin = await adminsService.findOne({ id: admin.id })
        })

        it("Should add a member to an existing group via API", async () => {
            const { members } = await groupsService.addMemberWithAPIKey(
                group.id,
                "123123",
                apiKey
            )

            expect(members).toHaveLength(1)
        })

        it("Should not add a member if they already exist", async () => {
            const fun = groupsService.addMemberWithAPIKey(
                group.id,
                "123123",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Member '123123' already exists in the group '${group.id}'`
            )
        })

        it("Should remove a member from an existing group via API", async () => {
            await groupsService.addMemberWithAPIKey(group.id, "100001", apiKey)

            const { members } = await groupsService.removeMemberWithAPIKey(
                group.id,
                "100001",
                apiKey
            )

            expect(members.map((m) => m.id)).not.toContain("100001")
        })

        it("Should not remove a member if they does not exist", async () => {
            const fun = groupsService.removeMemberWithAPIKey(
                group.id,
                "100001",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Member '100001' is not a member of group '${group.id}'`
            )
        })

        it("Should not add a member to an existing group if API belongs to another admin", async () => {
            const fun = groupsService.addMemberWithAPIKey(
                groupId,
                "100002",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid admin for group '${groupId}'`
            )
        })

        it("Should not remove a member to an existing group if API belongs to another admin", async () => {
            const fun = groupsService.removeMemberWithAPIKey(
                groupId,
                "100001",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid admin for group '${groupId}'`
            )
        })

        it("Should not add a member to an existing group if API is invalid", async () => {
            const fun = groupsService.addMemberWithAPIKey(
                group.id,
                "100002",
                "apiKey"
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })

        it("Should not remove a member to an existing group if API is invalid", async () => {
            const fun = groupsService.removeMemberWithAPIKey(
                group.id,
                "100001",
                "apiKey"
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })

        it("Should not add a member to an existing group if API is disabled", async () => {
            await adminsService.updateApiKey({
                adminId: admin.id,
                action: ApiKeyActions.Disable
            })

            const fun = groupsService.addMemberWithAPIKey(
                group.id,
                "100002",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })

        it("Should not remove a member to an existing group if API is disabled", async () => {
            const fun = groupsService.removeMemberWithAPIKey(
                group.id,
                "100001",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })
    })

    describe("# Add and remove members via API", () => {
        let admin: Admin
        let group: Group
        let apiKey: string

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            apiKey = await adminsService.updateApiKey({
                adminId: admin.id,
                action: ApiKeyActions.Generate
            })

            group = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                admin.id
            )

            admin = await adminsService.findOne({ id: admin.id })
        })

        it("Should add a member to an existing group via API", async () => {
            const { members } = await groupsService.addMembersWithAPIKey(
                group.id,
                ["123123", "456456", "789789"],
                apiKey
            )

            expect(members).toHaveLength(3)
        })

        it("Should not add a member if they already exist", async () => {
            const fun = groupsService.addMembersWithAPIKey(
                group.id,
                ["123123", "456456", "789789"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Member '123123' already exists in the group '${group.id}'`
            )
        })

        it("Should remove members from an existing group via API", async () => {
            await groupsService.addMembersWithAPIKey(
                group.id,
                ["100001", "100002", "100003"],
                apiKey
            )

            const { members } = await groupsService.removeMembersWithAPIKey(
                group.id,
                ["100001", "100002", "100003"],
                apiKey
            )

            expect(members.map((m) => m.id)).not.toContain("100001")
            expect(members.map((m) => m.id)).not.toContain("100002")
            expect(members.map((m) => m.id)).not.toContain("100003")
        })

        it("Should not remove a member if they does not exist", async () => {
            const fun = groupsService.removeMembersWithAPIKey(
                group.id,
                ["100001"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Member '100001' is not a member of group '${group.id}'`
            )
        })

        it("Should not add a member to an existing group if API belongs to another admin", async () => {
            const fun = groupsService.addMembersWithAPIKey(
                groupId,
                ["100002"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid admin for group '${groupId}'`
            )
        })

        it("Should not remove a member to an existing group if API belongs to another admin", async () => {
            const fun = groupsService.removeMembersWithAPIKey(
                groupId,
                ["100001"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid admin for group '${groupId}'`
            )
        })

        it("Should not add a member to an existing group if API is invalid", async () => {
            const fun = groupsService.addMembersWithAPIKey(
                group.id,
                ["100002"],
                "apiKey"
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })

        it("Should not remove a member to an existing group if API is invalid", async () => {
            const fun = groupsService.removeMembersWithAPIKey(
                group.id,
                ["100001"],
                "apiKey"
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })

        it("Should not add a member to an existing group if API is disabled", async () => {
            await adminsService.updateApiKey({
                adminId: admin.id,
                action: ApiKeyActions.Disable
            })

            const fun = groupsService.addMembersWithAPIKey(
                group.id,
                ["100002"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })

        it("Should not remove a member to an existing group if API is disabled", async () => {
            const fun = groupsService.removeMembersWithAPIKey(
                group.id,
                ["100001"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                "Invalid API key or API access not enabled for group"
            )
        })
    })

    describe("# addMemberManually", () => {
        let group: Group

        beforeAll(async () => {
            group = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                "admin"
            )
        })

        it("Should add a member to an existing group manually", async () => {
            const { members } = await groupsService.addMemberManually(
                group.id,
                "123123",
                "admin"
            )

            expect(members).toHaveLength(1)
        })

        it("Should not add a member if they already exists", async () => {
            const fun = groupsService.addMemberManually(
                group.id,
                "123123",
                "admin"
            )

            await expect(fun).rejects.toThrow(
                `Member '123123' already exists in the group '${group.id}'`
            )
        })

        it("Should not add a member if the admin is the wrong admin", async () => {
            const fun = groupsService.addMemberManually(
                group.id,
                "123123",
                "wrong-admin"
            )

            await expect(fun).rejects.toThrow("You are not the admin")
        })
    })

    describe("# addMembersManually", () => {
        let group: Group

        beforeAll(async () => {
            group = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                "admin"
            )
        })

        it("Should add members to an existing group manually in order", async () => {
            const { members } = await groupsService.addMembersManually(
                group.id,
                ["789789", "122121", "456456"],
                "admin"
            )

            expect(members).toHaveLength(3)
            expect(members.map((m) => m.id)).toEqual([
                "789789",
                "122121",
                "456456"
            ])
        })

        it("Should not add members if they already exists", async () => {
            const fun = groupsService.addMembersManually(
                group.id,
                ["123123", "456456", "789790"],
                "admin"
            )

            await expect(fun).rejects.toThrow(
                `Member '456456' already exists in the group '${group.id}'`
            )
        })

        it("Should not add a member if the admin is the wrong admin", async () => {
            const fun = groupsService.addMembersManually(
                group.id,
                ["123123", "456456", "789789"],
                "wrong-admin"
            )

            await expect(fun).rejects.toThrow("You are not the admin")
        })
    })

    describe("# initialize", () => {
        it("Should initialize the cached groups", async () => {
            const currentCachedGroups = await groupsService.getGroups()

            await groupsService.initialize()

            const updatedCachedGroups = await groupsService.getGroups()

            expect(currentCachedGroups).toHaveLength(updatedCachedGroups.length)
            expect(currentCachedGroups).toStrictEqual(updatedCachedGroups)
        })
    })
})
