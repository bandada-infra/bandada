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
import { AdminsModule } from "../admins/admins.module"

jest.mock("@bandada/utils", () => {
    const originalModule = jest.requireActual("@bandada/utils")

    return {
        __esModule: true,
        ...originalModule,
        getBandadaContract: () => ({
            updateGroups: () => ({
                status: true,
                logs: ["1"]
            }),
            getGroups: () => []
        }),
        blockchainCredentialSupportedNetworks: [
            {
                id: "sepolia",
                name: "Sepolia"
            }
        ]
    }
})

jest.mock("@bandada/credentials", () => ({
    __esModule: true,
    getProvider: jest.fn(() => ({
        getAccessToken: () => "123",
        getProfile: () => ({
            id: "id"
        }),
        getJsonRpcProvider: jest.fn()
    })),
    validateCredentials: jest.fn(() => true),
    providers: [{ name: "twitter" }, { name: "github" }, { name: "blockchain" }]
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
                ScheduleModule.forRoot(),
                AdminsModule
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
                providerName: "github"
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
                providerName: "github"
            })

            expect(stateId).toHaveLength(36)
        })

        it("Should throw an error if the member already exists in the group", async () => {
            ;(getProvider as any).mockImplementationOnce(
                () =>
                    ({
                        getAccessToken: jest.fn(() => "123"),
                        getProfile: jest.fn(() => ({
                            id: "id1"
                        }))
                    } as any)
            )

            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "123",
                providerName: "github"
            })

            await credentialsService.addMember(_stateId, "code")

            const fun = credentialsService.setOAuthState({
                groupId,
                memberId: "123",
                providerName: "github"
            })

            await expect(fun).rejects.toThrow(
                `Member '123' already exists in the group '${groupId}'`
            )
        })
    })

    describe("# addMember", () => {
        it("Should throw an error if the OAuth does not exist", async () => {
            const fun = credentialsService.addMember("123", "code")

            await expect(fun).rejects.toThrow(`OAuth state does not exist`)
        })

        it("Should add a member to a credential group", async () => {
            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "124",
                providerName: "github"
            })

            const clientRedirectUri = await credentialsService.addMember(
                _stateId,
                "code"
            )

            expect(clientRedirectUri).toBeUndefined()
        })

        it("Should add the same credential with different identities in different groups", async () => {
            const { id: _groupId } = await groupsService.createGroup(
                {
                    name: "Group2",
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

            const _stateId1 = await credentialsService.setOAuthState({
                groupId,
                memberId: "125",
                providerName: "github"
            })

            const _stateId2 = await credentialsService.setOAuthState({
                groupId: _groupId,
                memberId: "126",
                providerName: "github"
            })

            ;(getProvider as any).mockImplementationOnce(
                () =>
                    ({
                        getAccessToken: jest.fn(() => "123"),
                        getProfile: jest.fn(() => ({
                            id: "id2" // same OAuth account.
                        }))
                    } as any)
            )

            const clientRedirectUri1 = await credentialsService.addMember(
                _stateId1,
                "code"
            )

            expect(clientRedirectUri1).toBeUndefined()

            const clientRedirectUri2 = await credentialsService.addMember(
                _stateId2,
                "code"
            )

            expect(clientRedirectUri2).toBeUndefined()
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
                memberId: "127",
                providerName: "github"
            })

            const fun = credentialsService.addMember(_stateId, "code")

            await expect(fun).rejects.toThrow(
                `OAuth account does not match criteria`
            )
        })

        it("Should throw an error if the same OAuth account tries to join the same group", async () => {
            ;(getProvider as any).mockImplementationOnce(
                () =>
                    ({
                        getAccessToken: jest.fn(() => "123"),
                        getProfile: jest.fn(() => ({
                            id: "id2" // OAuth account already used to join the group.
                        }))
                    } as any)
            )

            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "128",
                providerName: "github"
            })

            const fun = credentialsService.addMember(_stateId, "code")

            await expect(fun).rejects.toThrow(
                `OAuth account has already joined the group`
            )
        })

        it("Should add a member to a credential group using the number of transactions", async () => {
            const { id } = await groupsService.createGroup(
                {
                    name: "Group2",
                    description: "This is a description",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: JSON.stringify({
                        id: "BLOCKCHAIN_TRANSACTIONS",
                        criteria: {
                            minTransactions: 12,
                            network: "sepolia"
                        }
                    })
                },
                "admin"
            )

            groupId = id

            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "1",
                providerName: "blockchain"
            })

            const clientRedirectUri = await credentialsService.addMember(
                _stateId,
                undefined,
                "0x"
            )

            expect(clientRedirectUri).toBeUndefined()
        })

        it("Should add a member to a credential group using the number of transactions at a specific block number", async () => {
            const _stateId = await credentialsService.setOAuthState({
                groupId,
                memberId: "2",
                providerName: "blockchain"
            })

            const clientRedirectUri = await credentialsService.addMember(
                _stateId,
                undefined,
                "0x1"
            )

            expect(clientRedirectUri).toBeUndefined()
        })
    })
})
