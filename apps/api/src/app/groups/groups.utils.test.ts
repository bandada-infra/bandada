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
import { mapGroupToResponseDTO, getAndCheckAdmin } from "./groups.utils"

describe("Groups utils", () => {
    let groupsService: GroupsService
    let adminsService: AdminsService

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
        adminsService = await module.resolve(AdminsService)

        await groupsService.initialize()
    })

    describe("# mapGroupToResponseDTO", () => {
        it("Should map the group data", async () => {
            const group = {
                members: [
                    {
                        id: 1
                    }
                ]
            }

            const { members } = mapGroupToResponseDTO(group as any)

            expect(members).toHaveLength(1)
            expect(members[0]).toBe(1)
        })

        it("Should map the group members, even if there are not members", async () => {
            const { members } = mapGroupToResponseDTO({} as any)

            expect(members).toHaveLength(0)
        })

        it("Should map the fingerprint correctly", async () => {
            const { fingerprint } = mapGroupToResponseDTO({} as any, "12345")

            expect(fingerprint).toBe("12345")
        })
    })

    describe("# getAndCheckAdmin", () => {
        const groupId = "1"
        let apiKey = ""
        let admin: Admin = {} as any

        beforeAll(async () => {
            admin = await adminsService.create({
                id: groupId,
                address: "0x00"
            })

            apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )

            admin = await adminsService.findOne({ id: admin.id })
        })

        it("Should successfully check and return the admin", async () => {
            const checkedAdmin = await getAndCheckAdmin(adminsService, apiKey)

            expect(checkedAdmin.id).toBe(admin.id)
            expect(checkedAdmin.address).toBe(admin.address)
            expect(checkedAdmin.apiKey).toBe(admin.apiKey)
            expect(checkedAdmin.apiEnabled).toBe(admin.apiEnabled)
            expect(checkedAdmin.username).toBe(admin.username)
        })

        it("Should throw if the API Key or admin is invalid", async () => {
            const fun = getAndCheckAdmin(adminsService, "wrong")

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the groups`
            )
        })

        it("Should throw if the API Key or admin is invalid (w/ group identifier)", async () => {
            const fun = getAndCheckAdmin(adminsService, "wrong", groupId)

            await expect(fun).rejects.toThrow(
                `Invalid API key or invalid admin for the group '${groupId}'`
            )
        })

        it("Should throw if the API Key is invalid or API access is disabled", async () => {
            await adminsService.updateApiKey(admin.id, ApiKeyActions.Disable)

            const fun = getAndCheckAdmin(adminsService, apiKey)

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })

        it("Should throw if the API Key is invalid or API access is disabled (w/ group identifier)", async () => {
            const fun = getAndCheckAdmin(adminsService, apiKey, groupId)

            await expect(fun).rejects.toThrow(
                `Invalid API key or API access not enabled for admin '${admin.id}'`
            )
        })
    })
})
