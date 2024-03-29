import { id as idToHash } from "@ethersproject/hash"
import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApiKeyActions } from "@bandada/utils"
import { AdminsService } from "./admins.service"
import { Admin } from "./entities/admin.entity"

describe("AdminsService", () => {
    const id = "1"
    const hashedId = idToHash(id)
    const address = "0x000000"
    let admin: Admin
    let adminsService: AdminsService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: "sqlite",
                        database: ":memory:",
                        dropSchema: true,
                        entities: [Admin],
                        synchronize: true
                    })
                }),
                TypeOrmModule.forFeature([Admin]),
                ScheduleModule.forRoot()
            ],
            providers: [AdminsService]
        }).compile()
        adminsService = await module.resolve(AdminsService)
    })

    describe("# create", () => {
        it("Should create an admin", async () => {
            admin = await adminsService.create({ id, address })

            expect(admin.id).toBe(idToHash(id))
            expect(admin.address).toBe(address)
            expect(admin.username).toBe(address.slice(-5))
            expect(admin.apiEnabled).toBeFalsy()
            expect(admin.apiKey).toBeNull()
        })

        it("Should create an admin given the username", async () => {
            const id2 = "2"
            const address2 = "0x000002"
            const username = "admn2"

            const admin = await adminsService.create({
                id: id2,
                address: address2,
                username
            })

            expect(admin.id).toBe(idToHash(id2))
            expect(admin.address).toBe(address2)
            expect(admin.username).toBe(username)
            expect(admin.apiEnabled).toBeFalsy()
            expect(admin.apiKey).toBeNull()
        })
    })

    describe("# findOne", () => {
        it("Should return the admin given the identifier", async () => {
            const found = await adminsService.findOne({ id: hashedId })

            expect(found.id).toBe(admin.id)
            expect(found.address).toBe(admin.address)
            expect(found.username).toBe(admin.username)
            expect(found.apiEnabled).toBeFalsy()
            expect(found.apiKey).toBe(admin.apiKey)
        })

        it("Should return null if the given identifier does not belong to an admin", async () => {
            expect(await adminsService.findOne({ id: "3" })).toBeNull()
        })
    })

    describe("# updateApiKey", () => {
        it("Should create an apikey for the admin", async () => {
            const apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )

            admin = await adminsService.findOne({ id: hashedId })

            expect(admin.apiEnabled).toBeTruthy()
            expect(admin.apiKey).toBe(apiKey)
        })

        it("Should generate another apikey for the admin", async () => {
            const previousApiKey = admin.apiKey

            const apiKey = await adminsService.updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )

            admin = await adminsService.findOne({ id: hashedId })

            expect(admin.apiEnabled).toBeTruthy()
            expect(admin.apiKey).toBe(apiKey)
            expect(admin.apiKey).not.toBe(previousApiKey)
        })

        it("Should disable the apikey for the admin", async () => {
            const { apiKey } = admin

            await adminsService.updateApiKey(hashedId, ApiKeyActions.Disable)

            admin = await adminsService.findOne({ id: hashedId })

            expect(admin.apiEnabled).toBeFalsy()
            expect(admin.apiKey).toBe(apiKey)
        })

        it("Should enable the apikey for the admin", async () => {
            const { apiKey } = admin

            await adminsService.updateApiKey(hashedId, ApiKeyActions.Enable)

            admin = await adminsService.findOne({ id: hashedId })

            expect(admin.apiEnabled).toBeTruthy()
            expect(admin.apiKey).toBe(apiKey)
        })

        it("Should not create the apikey when the given id does not belog to an admin", async () => {
            const wrongId = "wrongId"

            const fun = adminsService.updateApiKey(
                wrongId,
                ApiKeyActions.Disable
            )

            await expect(fun).rejects.toThrow(
                `The '${wrongId}' does not belong to an admin`
            )
        })

        it("Should not enable the apikey before creation", async () => {
            const tempAdmin = await adminsService.create({
                id: "id2",
                address: "address2"
            })

            const fun = adminsService.updateApiKey(
                tempAdmin.id,
                ApiKeyActions.Enable
            )

            await expect(fun).rejects.toThrow(
                `The '${tempAdmin.id}' does not have an apikey`
            )
        })

        it("Shoul throw if the action does not exist", async () => {
            const wrongAction = "wrong-action"

            const fun = adminsService.updateApiKey(
                hashedId,
                // @ts-ignore
                wrongAction
            )

            await expect(fun).rejects.toThrow(
                `Unsupported ${wrongAction} apikey`
            )
        })
    })
})
