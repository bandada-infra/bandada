import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { GroupData } from "../groups/entities/group.entity"
import { GroupsService } from "../groups/groups.service"
import { CreateInviteDto } from "./dto/create-invite.dto"
import { Invite } from "./entities/invite.entity"
import { InvitesService } from "./invites.service"

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>
type MockGroupsService = Partial<Record<keyof GroupsService, jest.Mock>>

describe("InvitesService", () => {
    let invitesService: InvitesService
    let inviteRepository: MockRepository<Invite>
    let groupsService: MockGroupsService

    const group: GroupData = {
        id: 1,
        name: "Test",
        description: "This group is for unit test.",
        treeDepth: 16,
        index: 0,
        admin: "testAdmin",
        members: [],
        createdAt: new Date(),
        tag: 0
    }

    const invite: Invite = {
        id: 1,
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
                        save: jest.fn(),
                        findOneBy: jest.fn()
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

        it("Should not create an invite if an internal error is thrown", async () => {
            inviteRepository.create.mockResolvedValue(invite)
            inviteRepository.save.mockImplementation(() => {
                throw new Error("DB error")
            })
            groupsService.getGroupData.mockResolvedValue(group)

            const result = invitesService.createInvite(
                createInviteDto,
                "testAdmin"
            )

            await expect(result).rejects.toThrow("Internal Server Error")
        })
    })

    describe("# redeemInvite", () => {
        it("Should redeem an invite", async () => {
            inviteRepository.findOneBy.mockResolvedValue({ ...invite })
            inviteRepository.save.mockResolvedValue({
                ...invite,
                redeemed: true
            })

            const result = await invitesService.redeemInvite("MVHRJQWC")

            expect(result).toMatchObject({
                ...invite,
                redeemed: true
            })
        })

        it("Should not redeem an invite if it has already been redeemed", async () => {
            inviteRepository.findOneBy.mockResolvedValue({
                ...invite,
                redeemed: true
            })

            const result = invitesService.redeemInvite("MVHRJQWC")

            await expect(result).rejects.toThrow("has already been redeemed")
        })

        it("Should not redeem an invite if an internal error is thrown", async () => {
            inviteRepository.findOneBy.mockResolvedValue(invite)
            inviteRepository.save.mockImplementation(() => {
                throw new Error("DB error")
            })

            const result = invitesService.redeemInvite("MVHRJQWC")

            await expect(result).rejects.toThrow("Internal Server Error")
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
