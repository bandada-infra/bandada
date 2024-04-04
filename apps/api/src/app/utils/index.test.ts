import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApiKeyActions } from "@bandada/utils"
import { Invite } from "../invites/entities/invite.entity"
import { InvitesService } from "../invites/invites.service"
import { OAuthAccount } from "../credentials/entities/credentials-account.entity"
import { AdminsService } from "../admins/admins.service"
import { AdminsModule } from "../admins/admins.module"
import { Admin } from "../admins/entities/admin.entity"
import { GroupsService } from "../groups/groups.service"
import { Group } from "../groups/entities/group.entity"
import { Member } from "../groups/entities/member.entity"
import mapEntity from "./mapEntity"
import stringifyJSON from "./stringifyJSON"
import getAndCheckAdmin from "./getAndCheckAdmin"

describe("Utils", () => {
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

    describe("# mapEntity", () => {
        it("Should map a DB entity", async () => {
            const entity = mapEntity({ id: 1, a: 2 }) as any

            expect(entity.id).toBeUndefined()
            expect(Object.values(entity)).toHaveLength(1)
        })
    })

    describe("# stringifyJSON", () => {
        it("Should map a DB entity", async () => {
            const entity = JSON.parse(stringifyJSON({ a: 143234n, b: "a" }))

            expect(entity.a).toBe("143234")
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
