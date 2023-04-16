import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Invite } from "../invites/entities/invite.entity"
import { InvitesService } from "../invites/invites.service"
import { Group } from "./entities/group.entity"
import { Member } from "./entities/member.entity"
import { GroupsService } from "./groups.service"

jest.mock("@bandada/utils", () => ({
    __esModule: true,
    getBandadaContract: () => ({
        updateGroups: jest.fn(() => ({
            status: true,
            logs: ["1"]
        })),
        getGroups: jest.fn(() => [])
    })
}))

describe("GroupsService", () => {
    let groupsService: GroupsService
    let invitesService: InvitesService
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

        groupsService = await module.resolve(GroupsService)
        invitesService = await module.resolve(InvitesService)

        const { id } = await groupsService.createGroup(
            {
                name: "Group1",
                description: "This is a description",
                treeDepth: 16
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
                    treeDepth: 16
                },
                "admin"
            )

            expect(treeDepth).toBe(16)
            expect(members).toHaveLength(0)
        })
    })

    describe("# updateGroup", () => {
        it("Should update a group", async () => {
            const { description } = await groupsService.updateGroup(
                groupId,
                {
                    description: "This is a new description"
                },
                "admin"
            )

            expect(description).toContain("new")
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
    })

    describe("# getAllGroupsData", () => {
        it("Should return a list of groups", async () => {
            const result = await groupsService.getAllGroups()

            expect(result).toHaveLength(2)
        })
    })

    describe("# getGroupsByAdmin", () => {
        it("Should return a list of groups by admin", async () => {
            const result = await groupsService.getGroupsByAdmin("admin")

            expect(result).toHaveLength(2)
        })
    })

    describe("# getGroup", () => {
        it("Should return a group", async () => {
            const { treeDepth, members } = await groupsService.getGroup(groupId)

            expect(treeDepth).toBe(16)
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

        it("Should update contract on adding member", async () => {
            const invite2 = await invitesService.createInvite(
                { groupId },
                "admin"
            )

            await groupsService.joinGroup(groupId, "124", {
                inviteCode: invite2.code
            })

            expect(
                // @ts-ignore
                groupsService.bandadaContract.updateGroups
            ).toHaveBeenCalled()
        })

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

    describe("# removeMember", () => {
        it("Should remove a member if they exist in the group", async () => {
            const { id: _groupId } = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 21
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

            const { members: newMembers } = await groupsService.removeMember(
                _groupId,
                "111000",
                "admin"
            )

            expect(newMembers).toHaveLength(0)
        })

        it("Should throw error if member is not part of the group", async () => {
            const fun = groupsService.removeMember(groupId, "00000", "admin")

            await expect(fun).rejects.toThrow("is not a member of group")
        })

        it("Should throw error if member is removed by a non-admin", async () => {
            const { id: _groupId } = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a new group",
                    treeDepth: 21
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

            const fun = groupsService.removeMember(_groupId, "111000", "rndom")

            await expect(fun).rejects.toThrow("You are not the admin")
        })
    })

    describe("# API access", () => {
        let group: Group
        let apiKey: string

        it("Should generate a new API key", async () => {
            group = await groupsService.createGroup({
                name: "Group2",
                description: "This is a new group",
                treeDepth: 16
            }, "admin")

            await groupsService.updateGroup(group.id, { apiEnabled: true }, "admin")

            apiKey = (await groupsService.getGroup(group.id)).apiKey

            expect(apiKey.length).toBeGreaterThan(1)
        })
    })


    describe("# Add and remove member via API", () => {
        let group: Group
        let apiKey: string

        beforeAll(async () => {
            group = await groupsService.createGroup({
                name: "Group2",
                description: "This is a new group",
                treeDepth: 16
            }, "admin")

            await groupsService.updateGroup(group.id, { apiEnabled: true }, "admin")

            apiKey = (await groupsService.getGroup(group.id)).apiKey
        })

        it("Should add a member to an existing group via API", async () => {
            const { members } = await groupsService.addMemberWithAPIKey(
                group.id,
                "123123",
                apiKey
            )

            expect(members).toHaveLength(1)
        })

        it("Should delete a member from an existing group via API", async () => {
            await groupsService.addMemberWithAPIKey(
                group.id,
                "100001",
                apiKey
            )

            const { members } = await groupsService.removeMemberWithAPIKey(
                group.id,
                "100001",
                apiKey
            )

            expect(members.map(m => m.id)).not.toContain("100001")
        })

        it("Should not add a member to an existing group if API is disabled", async () => {
            await groupsService.updateGroup(group.id, { apiEnabled: false }, "admin")

            const promise = groupsService.addMemberWithAPIKey(
                groupId,
                "100002",
                apiKey
            )

            await expect(promise).rejects.toThrow("Invalid API key or API access not enabled for group")
        })
    })
})
