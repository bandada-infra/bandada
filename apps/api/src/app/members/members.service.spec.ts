import { Test, TestingModule } from "@nestjs/testing"
import { MembersService } from "./members.service"

describe("MembersService", () => {
    let service: MembersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MembersService]
        }).compile()

        service = module.get<MembersService>(MembersService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("getAllMembers", () => {
        it("should return an array", () => {
            const result = service.getAllMembers()

            expect(result).toBeInstanceOf(Array)
        })
    })

    describe("getMemberByIndex", () => {
        it("should return member", () => {
            service.addMember({
                identityCommitment: "test"
            })
            const member = service.getMemberByIndex(1)
            expect(member).toBeDefined()
        })
    })

    describe("addMember", () => {
        it("should add a member", () => {
            const beforeAdd = service.getAllMembers().length
            service.addMember({
                identityCommitment: "test"
            })
            const afterAdd = service.getAllMembers().length
            expect(afterAdd).toBeGreaterThan(beforeAdd)
        })

        it("should add a index of each member", () => {
            service.addMember({
                identityCommitment: "test1"
            })
            service.addMember({
                identityCommitment: "test2"
            })
            const secondMember = service.getMemberByIndex(2)
            expect(secondMember).toBeDefined()
        })
    })
})
