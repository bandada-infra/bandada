import { getProvider, validateCredentials } from "@bandada/credentials"
import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Group } from "../groups/entities/group.entity"
import { Member } from "../groups/entities/member.entity"
import { GroupsService } from "../groups/groups.service"
import { Invite } from "../invites/entities/invite.entity"
import { InvitesService } from "../invites/invites.service"
import { OAuthAccount } from "./entities/credentials-account.entity"
import { CredentialsService } from "./credentials.service"

jest.mock("@bandada/utils", () => ({
    __esModule: true,
    getBandadaContract: () => ({
        updateGroups: () => ({
            status: true,
            logs: ["1"]
        }),
        getGroups: () => []
    })
}))

jest.mock("@bandada/credentials", () => ({
    __esModule: true,
    getProvider: jest.fn(() => ({
        getAccessToken: () => "123",
        getProfile: () => ({
            id: "id"
        })
    })),
    validateCredentials: jest.fn(() => true)
}))

describe("CredentialsService", () => {
    let groupsService: GroupsService
    let credentialsService: CredentialsService
    let groupId: string
    let stateId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: "sqlite",
                        database: ":memory:",
                        dropSchema: true,
                        entities: [Group, Invite, Member, OAuthAccount],
                        synchronize: true
                    })
                }),
                TypeOrmModule.forFeature([Group, Invite, Member, OAuthAccount]),
                ScheduleModule.forRoot()
            ],
            providers: [GroupsService, InvitesService, CredentialsService]
        }).compile()

        groupsService = await module.resolve(GroupsService)
        credentialsService = await module.resolve(CredentialsService)

        const { id } = await groupsService.createGroup(
            {
                name: "Group1",
                description: "This is a description",
                treeDepth: 16,
                fingerprintDuration: 3600,
                credentials: JSON.stringify({
                    id: "GITHUB_FOLLOWERS",
                    criteria: {
                        minFollowers: 12
                    }
                })
            },
            "admin"
        )

        groupId = id
    })

    describe("# setOAuthState", () => {
        it("Should throw an error if the group is not a credential group", async () => {
            const { id: _groupId } = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                },
                "admin"
            )

            const fun = credentialsService.setOAuthState({
                groupId: _groupId,
                memberId: "123",
                providerName: "twitter"
            })

            await expect(fun).rejects.toThrow(
                `Group with id '${_groupId}' is not a credential group`
            )
        })

        it("Should throw an error if the provider is not supported", async () => {
            const fun = credentialsService.setOAuthState({
                groupId,
                memberId: "123",
                providerName: "reddit"
            })

            await expect(fun).rejects.toThrow(
                `OAuth provider 'reddit' is not supported`
            )
        })

        it("Should create and save a state id", async () => {
            stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "123",
                providerName: "twitter"
            })

            expect(stateId).toHaveLength(36)
        })

        it("Should throw an error if the member already exists in the group", async () => {
            ;(getProvider as any).mockImplementationOnce(
                () =>
                    ({
                        getAccessToken: jest.fn(() => "123"),
                        getProfile: jest.fn(() => ({
                            id: "id2"
                        }))
                    } as any)
            )

            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "123",
                providerName: "twitter"
            })

            await credentialsService.addMember("code", _stateId)

            const fun = credentialsService.setOAuthState({
                groupId,
                memberId: "123",
                providerName: "twitter"
            })

            await expect(fun).rejects.toThrow(
                `Member '123' already exists in the group '${groupId}'`
            )
        })
    })

    describe("# addMember", () => {
        it("Should throw an error if the OAuth does not exist", async () => {
            const fun = credentialsService.addMember("code", "123")

            await expect(fun).rejects.toThrow(`OAuth state does not exist`)
        })

        it("Should add a member to a credential group", async () => {
            const clientRedirectUri = await credentialsService.addMember(
                "code",
                stateId
            )

            expect(clientRedirectUri).toBeUndefined()
        })

        it("Should throw an error if the same OAuth account tries to join the same group", async () => {
            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "124",
                providerName: "twitter"
            })

            const fun = credentialsService.addMember("code", _stateId)

            await expect(fun).rejects.toThrow(
                `OAuth account has already joined the group`
            )
        })

        it("Should throw an error if the OAuth account does not have enough credential", async () => {
            ;(getProvider as any).mockImplementationOnce(
                () =>
                    ({
                        getAccessToken: jest.fn(() => "123"),
                        getProfile: jest.fn(() => ({
                            id: "id3"
                        }))
                    } as any)
            )
            ;(validateCredentials as any).mockImplementationOnce(
                async () => false
            )

            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "124",
                providerName: "twitter"
            })

            const fun = credentialsService.addMember("code", _stateId)

            await expect(fun).rejects.toThrow(
                `OAuth account does not match criteria`
            )
        })
    })
})
