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
import { mapGroupToResponseDTO } from "./groups.utils"

describe("Groups utils", () => {
    let groupsService: GroupsService

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
})
