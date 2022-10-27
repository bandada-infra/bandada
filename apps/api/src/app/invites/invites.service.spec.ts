import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ObjectId } from "mongodb"
import { MongoRepository } from "typeorm"
import { GroupData } from "../groups/entities/group.entity"
import { GroupsService } from "../groups/groups.service"
import { CreateInviteDto } from "./dto/create-invite.dto"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"

type mockRepository<T> = Partial<Record<keyof MongoRepository<T>, jest.Mock>>
type mockGroupsService = Partial<Record<keyof GroupsService, jest.Mock>>

describe("InvitesService", () => {
    let invitesService: InvitesService
    let inviteRepository: mockRepository<Invite>
    let groupsService: mockGroupsService

    const group: GroupData = {
        _id: new ObjectId(),
        name: "Test",
        description: "This group is for unit test.",
        treeDepth: 16,
        index: 0,
        admin: "testAdmin",
        members: [],
        createdAt: "2022-08-14T11:11:11.111Z",
        tag: 0
    }

    const invite: Invite = {
        _id: new ObjectId(),
        group: group,
        code: "MVHRJQWC",
        redeemed: false
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                InvitesService,
                {
                    provide: GroupsService,
                    useValue: {
                        getGroupData: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Invite),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn()
                    }
                }
            ]
        }).compile()

        invitesService = module.get(InvitesService)
        inviteRepository = module.get(getRepositoryToken(Invite))
        groupsService = module.get(GroupsService)
    })

    describe("# createInvite", () => {
        const createInviteDto: CreateInviteDto = {
            groupName: "Test"
        }

        it("Should create an invite", async () => {
            inviteRepository.create.mockResolvedValue(invite)
            inviteRepository.save.mockResolvedValue(invite)
            groupsService.getGroupData.mockResolvedValue(group)

            const result = await invitesService.createInvite(
                createInviteDto,
                "testAdmin"
            )

            expect(result).toMatchObject(invite)
        })

        it("Should not create an invite if the admin is the wrong one", async () => {
            inviteRepository.create.mockResolvedValue(invite)
            inviteRepository.save.mockResolvedValue(invite)
            groupsService.getGroupData.mockResolvedValue(group)

            const result = invitesService.createInvite(
                createInviteDto,
                "testAdmin2"
            )

            await expect(result).rejects.toThrow("No permissions")
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
