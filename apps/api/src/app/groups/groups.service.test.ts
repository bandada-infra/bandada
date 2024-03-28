import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApiKeyActions } from "@bandada/utils"
import { Invite } from "../invites/entities/invite.entity"
import { InvitesService } from "../invites/invites.service"
import { OAuthAccount } from "../credentials/entities/credentials-account.entity"
import { Group } from "./entities/group.entity"
import { Member } from "./entities/member.entity"
import { GroupsService } from "./groups.service"
import { AdminsService } from "../admins/admins.service"
import { AdminsModule } from "../admins/admins.module"
import { Admin } from "../admins/entities/admin.entity"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"

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
            getGroups: jest.fn(() => []),
            updateFingerprintDuration: jest.fn(() => null)
        })
    }
})

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

    describe("# Create and remove group via API", () => {
        const groupDto: CreateGroupDto = {
            name: "Group",
            description: "This is a new group",
            treeDepth: 16,
            fingerprintDuration: 3600
        }
        let admin: Admin
        let apiKey: string

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )

            admin = await adminsService.findOne({ id: admin.id })
        })

        it("Should create a group via API", async () => {
            const group = await groupsService.createGroupWithAPIKey(
                groupDto,
                apiKey
            )

            expect(group.adminId).toBe(admin.id)
            expect(group.description).toBe(groupDto.description)
            expect(group.name).toBe(groupDto.name)
            expect(group.treeDepth).toBe(groupDto.treeDepth)
            expect(group.fingerprintDuration).toBe(groupDto.fingerprintDuration)
            expect(group.members).toHaveLength(0)
            expect(group.credentials).toBeNull()
        })

        it("Should remove a group via API", async () => {
            const group = await groupsService.createGroupWithAPIKey(
                groupDto,
                apiKey
            )

            await groupsService.removeGroupWithAPIKey(group.id, apiKey)

            const fun = groupsService.getGroup(group.id)

            await expect(fun).rejects.toThrow(
                `Group with id '${group.id}' does not exist`
            )
        })

        it("Should not create a group if the admin does not exist", async () => {
            const fun = groupsService.createGroupWithAPIKey(groupDto, "wrong")

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not remove a group if the admin does not exist", async () => {
            const group = await groupsService.createGroupWithAPIKey(
                groupDto,
                apiKey
            )

            const fun = groupsService.removeGroupWithAPIKey(group.id, "wrong")

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not create a group if the API key is invalid", async () => {
            const fun = groupsService.createGroupWithAPIKey(groupDto, "apiKey")

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not remove a group if the API key is invalid", async () => {
            const group = await groupsService.createGroupWithAPIKey(
                groupDto,
                apiKey
            )

            const fun = groupsService.removeGroupWithAPIKey(group.id, "wrong")

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not create a group if the API key is disabled for the admin", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = groupsService.createGroupWithAPIKey(groupDto, apiKey)

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })

        it("Should not remove a group if the API key is disabled for the admin", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Enable)

            const group = await groupsService.createGroupWithAPIKey(
                groupDto,
                apiKey
            )

            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = groupsService.removeGroupWithAPIKey(group.id, apiKey)

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })

        it("Should not remove a group if the given id does not belong to the group admin", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Enable)

            const group = await groupsService.createGroupWithAPIKey(
                groupDto,
                apiKey
            )

            let anotherAdmin = await adminsService.create({
                id: "admin2",
                address: "0x02"
            })

            const anotherApiKey = await adminsService.updateApiKey(
                anotherAdmin.id,
                ApiKeyActions.Generate
            )

            anotherAdmin = await adminsService.findOne({ id: anotherAdmin.id })

            const fun = groupsService.removeGroupWithAPIKey(
                group.id,
                anotherApiKey
            )

            await expect(fun).rejects.toThrow(
                `You are not the admin of the group '${group.id}'`
            )
        })
    })

    describe("# Create and remove groups via API", () => {
        const groupsDtos: Array<CreateGroupDto> = [
            {
                id: "1",
                name: "Group1",
                description: "This is a new group1",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            {
                id: "2",
                name: "Group2",
                description: "This is a new group2",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            {
                id: "3",
                name: "Group3",
                description: "This is a new group3",
                treeDepth: 16,
                fingerprintDuration: 3600
            }
        ]
        const ids = groupsDtos.map((dto) => dto.id)
        let admin: Admin
        let apiKey: string

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )

            admin = await adminsService.findOne({ id: admin.id })
        })

        it("Should create the groups via API", async () => {
            const groups = await groupsService.createGroupsWithAPIKey(
                groupsDtos,
                apiKey
            )

            groups.forEach((group: Group, i: number) => {
                expect(group.id).toBe(groupsDtos[i].id)
                expect(group.adminId).toBe(admin.id)
                expect(group.description).toBe(groupsDtos[i].description)
                expect(group.name).toBe(groupsDtos[i].name)
                expect(group.treeDepth).toBe(groupsDtos[i].treeDepth)
                expect(group.fingerprintDuration).toBe(
                    groupsDtos[i].fingerprintDuration
                )
                expect(group.members).toHaveLength(0)
                expect(group.credentials).toBeNull()
            })
        })

        it("Should remove the groups via API", async () => {
            let groups = await groupsService.getGroups({
                adminId: admin.id
            })

            expect(groups).toHaveLength(4)

            await groupsService.removeGroupsWithAPIKey([ids[0], ids[1]], apiKey)

            groups = await groupsService.getGroups({
                adminId: admin.id
            })

            expect(groups).toHaveLength(2)
            const group = groups.at(1)
            const groupDto = groupsDtos.at(2)

            expect(group.id).toBe(groupDto.id)
            expect(group.adminId).toBe(admin.id)
            expect(group.description).toBe(groupDto.description)
            expect(group.name).toBe(groupDto.name)
            expect(group.treeDepth).toBe(groupDto.treeDepth)
            expect(group.fingerprintDuration).toBe(groupDto.fingerprintDuration)
            expect(group.members).toHaveLength(0)
            expect(group.credentials).toBeNull()

            const fun = groupsService.getGroup(ids[1])

            await expect(fun).rejects.toThrow(
                `Group with id '${ids[1]}' does not exist`
            )
        })

        it("Should not create the groups if the admin does not exist", async () => {
            const fun = groupsService.createGroupsWithAPIKey(
                groupsDtos,
                "wrong"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not remove the groups if the admin does not exist", async () => {
            const fun = groupsService.removeGroupsWithAPIKey(ids, "wrong")

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not create the groups if the API key is invalid", async () => {
            const fun = groupsService.createGroupsWithAPIKey(
                groupsDtos,
                "wrong"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not remove the groups if the API key is invalid", async () => {
            const fun = groupsService.removeGroupsWithAPIKey(ids, "wrong")

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not create the groups if the API key is disabled for the admin", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = groupsService.createGroupsWithAPIKey(groupsDtos, apiKey)

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })

        it("Should not remove the groups if the API key is disabled for the admin", async () => {
            const fun = groupsService.removeGroupsWithAPIKey(ids, apiKey)

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })

        it("Should not remove the groups if the given id does not belong to the group admin", async () => {
            let anotherAdmin = await adminsService.create({
                id: "admin2",
                address: "0x02"
            })

            const anotherApiKey = await adminsService.updateApiKey(
                anotherAdmin.id,
                ApiKeyActions.Generate
            )

            anotherAdmin = await adminsService.findOne({ id: anotherAdmin.id })

            const fun = groupsService.removeGroupsWithAPIKey(
                [ids[2]],
                anotherApiKey
            )

            await expect(fun).rejects.toThrow(
                `You are not the admin of the group '${ids[2]}'`
            )
        })
    })

    describe("# Update group via API", () => {
        const groupDto: CreateGroupDto = {
            id: "1",
            name: "Group1",
            description: "This is a new group1",
            treeDepth: 16,
            fingerprintDuration: 3600
        }

        const updateDto: UpdateGroupDto = {
            description: "This is a new new group1",
            treeDepth: 32,
            fingerprintDuration: 7200
        }
        let admin: Admin
        let apiKey: string
        let group: Group

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )
            admin = await adminsService.findOne({ id: admin.id })
            group = await groupsService.createGroup(groupDto, admin.id)
        })

        it("Should update the group via API", async () => {
            const updatedGroup = await groupsService.updateGroupWithApiKey(
                group.id,
                updateDto,
                apiKey
            )

            expect(updatedGroup.id).toBe(groupDto.id)
            expect(updatedGroup.adminId).toBe(admin.id)
            expect(updatedGroup.description).toBe(updateDto.description)
            expect(updatedGroup.name).toBe(groupDto.name)
            expect(updatedGroup.treeDepth).toBe(updateDto.treeDepth)
            expect(updatedGroup.fingerprintDuration).toBe(
                updateDto.fingerprintDuration
            )
            expect(updatedGroup.members).toHaveLength(0)
            expect(updatedGroup.credentials).toBeNull()
        })

        it("Should not update a group if the admin is the wrong one", async () => {
            const fun = groupsService.updateGroupWithApiKey(
                groupId,
                groupDto,
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `You are not the admin of the group '${groupId}'`
            )
        })

        it("Should not update a group if the group does not exist", async () => {
            const fun = groupsService.updateGroupWithApiKey(
                "wrong",
                groupDto,
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Group with id 'wrong' does not exist`
            )
        })

        it("Should not update a group if the API key is invalid", async () => {
            const fun = groupsService.updateGroupWithApiKey(
                groupId,
                groupDto,
                "invalid-apikey"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not update a group if the API key is disabled", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = groupsService.updateGroupWithApiKey(
                groupId,
                groupDto,
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })
    })

    describe("# Update groups via API", () => {
        const groupsDtos: Array<CreateGroupDto> = [
            {
                id: "1",
                name: "Group1",
                description: "This is a new group1",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            {
                id: "2",
                name: "Group2",
                description: "This is a new group2",
                treeDepth: 32,
                fingerprintDuration: 7200
            }
        ]

        const updateDtos: Array<UpdateGroupDto> = [
            {
                description: "This is a new new group1",
                treeDepth: 32,
                fingerprintDuration: 7200
            },
            {
                description: "This is a new new group2",
                treeDepth: 32,
                fingerprintDuration: 14400
            }
        ]
        let admin: Admin
        let apiKey: string
        let groups: Array<Group>
        let groupId1: string
        let groupId2: string

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            admin = await adminsService.findOne({ id: admin.id })
            apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )
            groups = await groupsService.createGroupsManually(
                groupsDtos,
                admin.id
            )
            groupId1 = groups[0].id
            groupId2 = groups[1].id
        })

        it("Should update the groups via API", async () => {
            const updatedGroups = await groupsService.updateGroupsWithApiKey(
                [groupId1, groupId2],
                updateDtos,
                apiKey
            )

            updatedGroups.forEach((updatedGroup: Group, i: number) => {
                expect(updatedGroup.id).toBe(groupsDtos[i].id)
                expect(updatedGroup.adminId).toBe(admin.id)
                expect(updatedGroup.description).toBe(updateDtos[i].description)
                expect(updatedGroup.name).toBe(groupsDtos[i].name)
                expect(updatedGroup.treeDepth).toBe(updateDtos[i].treeDepth)
                expect(updatedGroup.fingerprintDuration).toBe(
                    updateDtos[i].fingerprintDuration
                )
                expect(updatedGroup.members).toHaveLength(0)
            })
        })

        it("Should not update the groups if the admin is the wrong one", async () => {
            const fun = groupsService.updateGroupsWithApiKey(
                [groupId1, groupId2],
                groupsDtos,
                "wrong"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not update the groups if the group does not exist", async () => {
            const fun = groupsService.updateGroupsWithApiKey(
                ["wrong"],
                groupsDtos,
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Group with id 'wrong' does not exist`
            )
        })

        it("Should not update the groups if the API key is invalid", async () => {
            const fun = groupsService.updateGroupsWithApiKey(
                [groupId1, groupId2],
                groupsDtos,
                "invalid-apikey"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should not update the groups if the API key is disabled", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = groupsService.updateGroupsWithApiKey(
                [groupId1, groupId2],
                groupsDtos,
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
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

            apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )

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
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
            )
        })

        it("Should not remove a member to an existing group if API is invalid", async () => {
            const fun = groupsService.removeMemberWithAPIKey(
                group.id,
                "100001",
                "apiKey"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
            )
        })

        it("Should not add a member to an existing group if API is disabled", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = groupsService.addMemberWithAPIKey(
                group.id,
                "100002",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
            )
        })

        it("Should not remove a member to an existing group if API is disabled", async () => {
            const fun = groupsService.removeMemberWithAPIKey(
                group.id,
                "100001",
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
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

            apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )

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
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
            )
        })

        it("Should not remove a member to an existing group if API is invalid", async () => {
            const fun = groupsService.removeMembersWithAPIKey(
                group.id,
                ["100001"],
                "apiKey"
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
            )
        })

        it("Should not add a member to an existing group if API is disabled", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = groupsService.addMembersWithAPIKey(
                group.id,
                ["100002"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
            )
        })

        it("Should not remove a member to an existing group if API is disabled", async () => {
            const fun = groupsService.removeMembersWithAPIKey(
                group.id,
                ["100001"],
                apiKey
            )

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${group.adminId}'`
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

    describe("# createGroupManually", () => {
        const groupDto: CreateGroupDto = {
            id: "1",
            name: "Group1",
            description: "This is a new group1",
            treeDepth: 16,
            fingerprintDuration: 3600
        }
        let admin: Admin

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            admin = await adminsService.findOne({ id: admin.id })
        })

        it("Should create a group manually", async () => {
            const group = await groupsService.createGroupManually(
                groupDto,
                admin.id
            )

            expect(group.id).toBe(groupDto.id)
            expect(group.adminId).toBe(admin.id)
            expect(group.description).toBe(groupDto.description)
            expect(group.name).toBe(groupDto.name)
            expect(group.treeDepth).toBe(groupDto.treeDepth)
            expect(group.fingerprintDuration).toBe(groupDto.fingerprintDuration)
            expect(group.members).toHaveLength(0)
        })

        it("Should not create a group manually if the admin doesn't exist", async () => {
            const fun = groupsService.createGroupManually(groupDto, "wrong")

            await expect(fun).rejects.toThrow(`You are not an admin`)
        })
    })

    describe("# createGroupsManually", () => {
        const groupsDtos: Array<CreateGroupDto> = [
            {
                id: "1",
                name: "Group1",
                description: "This is a new group1",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            {
                id: "2",
                name: "Group2",
                description: "This is a new group2",
                treeDepth: 32,
                fingerprintDuration: 7200
            }
        ]
        let admin: Admin

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            admin = await adminsService.findOne({ id: admin.id })
        })

        it("Should create a group manually", async () => {
            const groups = await groupsService.createGroupsManually(
                groupsDtos,
                admin.id
            )

            groups.forEach((group: Group, i: number) => {
                expect(group.id).toBe(groupsDtos[i].id)
                expect(group.adminId).toBe(admin.id)
                expect(group.description).toBe(groupsDtos[i].description)
                expect(group.name).toBe(groupsDtos[i].name)
                expect(group.treeDepth).toBe(groupsDtos[i].treeDepth)
                expect(group.fingerprintDuration).toBe(
                    groupsDtos[i].fingerprintDuration
                )
                expect(group.members).toHaveLength(0)
            })
        })

        it("Should not create a group manually if the admin doesn't exist", async () => {
            const fun = groupsService.createGroupsManually(groupsDtos, "wrong")

            await expect(fun).rejects.toThrow(`You are not an admin`)
        })
    })

    describe("# removeGroupManually", () => {
        const groupDto: CreateGroupDto = {
            id: "1",
            name: "Group1",
            description: "This is a new group1",
            treeDepth: 16,
            fingerprintDuration: 3600
        }
        let admin: Admin
        let group: Group

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            admin = await adminsService.findOne({ id: admin.id })

            group = await groupsService.createGroupManually(groupDto, admin.id)
        })

        it("Should remove a group manually", async () => {
            await groupsService.removeGroupManually(group.id, admin.id)

            const fun = groupsService.getGroup(group.id)

            await expect(fun).rejects.toThrow(
                `Group with id '${group.id}' does not exist`
            )
        })

        it("Should not remove a group manually if the group doesn't exist", async () => {
            const fun = groupsService.removeGroupManually(group.id, admin.id)

            await expect(fun).rejects.toThrow(
                `Group with id '${group.id}' does not exist`
            )
        })

        it("Should not remove a group manually if the admin doesn't exist or is not the admin of the group", async () => {
            group = await groupsService.createGroupManually(groupDto, admin.id)

            const fun = groupsService.removeGroupManually(group.id, "wrong")

            await expect(fun).rejects.toThrow(
                `You are not the admin of the group '${group.id}'`
            )
        })
    })

    describe("# removeGroupsManually", () => {
        const groupsDtos: Array<CreateGroupDto> = [
            {
                id: "1",
                name: "Group1",
                description: "This is a new group1",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            {
                id: "2",
                name: "Group2",
                description: "This is a new group2",
                treeDepth: 32,
                fingerprintDuration: 7200
            }
        ]
        let admin: Admin
        let groups: Array<Group>
        let groupId1: string
        let groupId2: string

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            admin = await adminsService.findOne({ id: admin.id })

            groups = await groupsService.createGroupsManually(
                groupsDtos,
                admin.id
            )

            groupId1 = groups[0].id
            groupId2 = groups[1].id
        })

        it("Should remove the groups manually", async () => {
            await groupsService.removeGroupsManually(
                [groupId1, groupId2],
                admin.id
            )

            const fun1 = groupsService.getGroup(groupId1)
            const fun2 = groupsService.getGroup(groupId2)

            await expect(fun1).rejects.toThrow(
                `Group with id '${groupId1}' does not exist`
            )
            await expect(fun2).rejects.toThrow(
                `Group with id '${groupId2}' does not exist`
            )
        })

        it("Should not remove the groups manually if one or more group doesn't exist", async () => {
            const fun = groupsService.removeGroupsManually(
                [groupId1, groupId2],
                admin.id
            )

            await expect(fun).rejects.toThrow(
                `Group with id '${groupId1}' does not exist`
            )
        })

        it("Should not remove the groups manually if the admin doesn't exist or is not the admin of the group", async () => {
            groups = await groupsService.createGroupsManually(
                groupsDtos,
                admin.id
            )

            const fun = groupsService.removeGroupsManually(
                [groupId1, groupId2],
                "wrong"
            )

            await expect(fun).rejects.toThrow(
                `You are not the admin of the group '${groupId1}'`
            )
        })
    })

    describe("# updateGroupManually", () => {
        const groupDto: CreateGroupDto = {
            id: "1",
            name: "Group1",
            description: "This is a new group1",
            treeDepth: 16,
            fingerprintDuration: 3600
        }

        const updateDto: UpdateGroupDto = {
            description: "This is a new new group1",
            treeDepth: 32,
            fingerprintDuration: 7200
        }
        let admin: Admin
        let group: Group

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            admin = await adminsService.findOne({ id: admin.id })
            group = await groupsService.createGroupManually(groupDto, admin.id)
        })

        it("Should update a group manually", async () => {
            const updatedGroup = await groupsService.updateGroupManually(
                group.id,
                updateDto,
                admin.id
            )

            expect(updatedGroup.id).toBe(groupDto.id)
            expect(updatedGroup.adminId).toBe(admin.id)
            expect(updatedGroup.description).toBe(updateDto.description)
            expect(updatedGroup.name).toBe(groupDto.name)
            expect(updatedGroup.treeDepth).toBe(updateDto.treeDepth)
            expect(updatedGroup.fingerprintDuration).toBe(
                updateDto.fingerprintDuration
            )
            expect(updatedGroup.members).toHaveLength(0)
            expect(updatedGroup.credentials).toBeNull()
        })

        it("Should not update a group manually if the group doesn't exist", async () => {
            const fun = groupsService.updateGroupManually(
                "wrong",
                updateDto,
                admin.id
            )

            await expect(fun).rejects.toThrow(
                `Group with id 'wrong' does not exist`
            )
        })

        it("Should not update a group manually if the admin doesn't exist or is not the admin of the group", async () => {
            const fun = groupsService.updateGroupManually(
                group.id,
                updateDto,
                "wrong"
            )

            await expect(fun).rejects.toThrow(
                `You are not the admin of the group '${group.id}'`
            )
        })
    })

    describe("# updateGroupsManually", () => {
        const groupsDtos: Array<CreateGroupDto> = [
            {
                id: "1",
                name: "Group1",
                description: "This is a new group1",
                treeDepth: 16,
                fingerprintDuration: 3600
            },
            {
                id: "2",
                name: "Group2",
                description: "This is a new group2",
                treeDepth: 32,
                fingerprintDuration: 7200
            }
        ]

        const updateDtos: Array<UpdateGroupDto> = [
            {
                description: "This is a new new group1",
                treeDepth: 32,
                fingerprintDuration: 7200
            },
            {
                description: "This is a new new group2",
                treeDepth: 32,
                fingerprintDuration: 14400
            }
        ]
        let admin: Admin
        let groups: Array<Group>
        let groupId1: string
        let groupId2: string

        beforeAll(async () => {
            admin = await adminsService.create({
                id: "admin",
                address: "0x"
            })

            admin = await adminsService.findOne({ id: admin.id })
            groups = await groupsService.createGroupsManually(
                groupsDtos,
                admin.id
            )
            groupId1 = groups[0].id
            groupId2 = groups[1].id
        })

        it("Should update the groups manually", async () => {
            const updatedGroups = await groupsService.updateGroupsManually(
                [groupId1, groupId2],
                updateDtos,
                admin.id
            )

            updatedGroups.forEach((updatedGroup: Group, i: number) => {
                expect(updatedGroup.id).toBe(groupsDtos[i].id)
                expect(updatedGroup.adminId).toBe(admin.id)
                expect(updatedGroup.description).toBe(updateDtos[i].description)
                expect(updatedGroup.name).toBe(groupsDtos[i].name)
                expect(updatedGroup.treeDepth).toBe(updateDtos[i].treeDepth)
                expect(updatedGroup.fingerprintDuration).toBe(
                    updateDtos[i].fingerprintDuration
                )
                expect(updatedGroup.members).toHaveLength(0)
            })
        })

        it("Should not update the groups manually if one or more groups doesn't exist", async () => {
            const fun = groupsService.updateGroupsManually(
                ["wrong"],
                updateDtos,
                admin.id
            )

            await expect(fun).rejects.toThrow(
                `Group with id 'wrong' does not exist`
            )
        })

        it("Should not update the groups manually if the admin doesn't exist or is not the admin of the groups", async () => {
            const fun = groupsService.updateGroupsManually(
                [groupId1, groupId2],
                updateDtos,
                "wrong"
            )

            await expect(fun).rejects.toThrow(
                `You are not the admin of the group '${groupId1}'`
            )
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
